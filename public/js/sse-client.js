(function() {
    'use strict';

    console.log('SSE Client starting...');

    const eventSource = new EventSource('/api/events');

    let lastMessage = '';
    let lastMessageTime = 0;

    //  HÀM XỬ LÝ CHUNG 
    function handleEvent(event) {
        try {
            const data = JSON.parse(event.data);
            console.log('SSE received:', data);
            
            if (data && data.message) {
                const now = Date.now();
                if (data.message === lastMessage && (now - lastMessageTime) < 1000) {
                    return;
                }
                lastMessage = data.message;
                lastMessageTime = now;
                showNotification(data.message);
            }
        } catch (e) {
            console.error('SSE Error:', e);
        }
    }

    //  ĐĂNG KÝ LẮNG NGHE
    eventSource.addEventListener('create', handleEvent);
    eventSource.addEventListener('update', handleEvent);
    eventSource.addEventListener('delete', handleEvent);
    
    //  XỬ LÝ LỖI
    eventSource.onerror = function() {};

    //  HÀM HIỂN THỊ NOTIFICATION 
    function showNotification(message) {
        const old = document.querySelector('.sse-toast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.className = 'sse-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #1e293b;
            color: white;
            padding: 14px 20px;
            border-radius: 10px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
            z-index: 99999;
            max-width: 400px;
            font-size: 14px;
            animation: slideInRight 0.4s ease;
        `;

        toast.innerHTML = `
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="flex:1;">${message}</span>
                <button onclick="this.closest('.sse-toast').remove()" 
                        style="background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:18px;">
                    ✕
                </button>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(function() {
            if (toast.parentElement) {
                toast.style.animation = 'slideOutRight 0.4s ease';
                setTimeout(function() {
                    if (toast.parentElement) toast.remove();
                }, 400);
            }
        }, 8000);
    }

    //  CSS ANIMATIONS 
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    console.log('SSE Client initialized successfully!');
})();