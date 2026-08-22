(function() {
    'use strict';

    function initMobileMenu() {
        const toggleBtn = document.getElementById('mobileToggle');
        const nav = document.querySelector('.header__nav');
        const right = document.querySelector('.header__right');
        
        if (!toggleBtn || !nav) return;

        toggleBtn.addEventListener('click', function() {
            const isOpen = nav.classList.toggle('open');
            this.setAttribute('aria-expanded', isOpen);
            
            const spans = this.querySelectorAll('span');
            
            if (isOpen) {
                // Menu mở -> biến thành dấu X
                spans.forEach((span, i) => {
                    if (i === 0) {span.style.transform = 'rotate(45deg) translate(5px, 5px)'; span.style.width = '25px';}
                    if (i === 1) {span.style.opacity = '0'; span.style.transform = 'scaleX(0)';}
                    if (i === 2) {span.style.transform = 'rotate(-45deg) translate(5px, -5px)'; span.style.width = '25px';}
                });
                
                // Hiển thị menu dọc
                if (right) {
                    right.style.display = 'flex';
                    right.style.flexDirection = 'column';
                    right.style.width = '100%';
                    right.style.gap = '10px';
                    right.style.paddingTop = '16px';
                    right.style.borderTop = '1px solid rgba(255,255,255,0.1)';
                }
            } else {
                // Menu đóng -> về 3 gạch
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                    span.style.width = '25px';
                });
                
                if (right) {
                    right.style.display = '';
                    right.style.flexDirection = '';
                    right.style.width = '';
                    right.style.gap = '';
                    right.style.paddingTop = '';
                    right.style.borderTop = '';
                }
            }
        });

        // Đóng menu khi click bên ngoài
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.header__inner')) {
                nav.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
                
                const spans = toggleBtn.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                    span.style.width = '25px';
                });
                
                if (right) {
                    right.style.display = '';
                    right.style.flexDirection = '';
                    right.style.width = '';
                    right.style.gap = '';
                    right.style.paddingTop = '';
                    right.style.borderTop = '';
                }
            }
        });
    }

    function highlightActiveMenu() {
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('.header__menu-item a');
        
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // LOAD TIME 
    window.addEventListener('load', function() {
        const loadTime = performance.now().toFixed(2);
        const footerBottom = document.querySelector('.footer__bottom');
        
        if (footerBottom) {
            const oldTime = footerBottom.querySelector('.load-time');
            if (oldTime) oldTime.remove();
            
            const timeEl = document.createElement('span');
            timeEl.className = 'load-time';
            timeEl.textContent = `Thời gian tải trang: ${loadTime} ms`;
            footerBottom.appendChild(timeEl);
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        highlightActiveMenu();
        console.log('ROYAL TRAVEL: Website ready');
    });

})();