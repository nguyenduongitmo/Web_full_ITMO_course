(function() {
    'use strict';

    const eventSource = new EventSource('/admin/tours/events');

    eventSource.addEventListener('create', handleEvent);
    eventSource.addEventListener('update', handleEvent);
    eventSource.addEventListener('delete', handleEvent);

    let lastMessage = '';
    let lastMessageTime = 0;

    function handleEvent(event) {
        try {
            const data = JSON.parse(event.data);
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
            // Bỏ qua lỗi
        }
    }

    eventSource.onerror = function() {
        // Bỏ qua lỗi
    };

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
})();