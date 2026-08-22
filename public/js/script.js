(function() {
    'use strict';

    function initMobileMenu() {
        const toggleBtn = document.getElementById('mobileToggle');
        const nav = document.querySelector('.header__nav');
        
        if (!toggleBtn || !nav) return;

        toggleBtn.addEventListener('click', function() {
            nav.classList.toggle('open');
            const isOpen = nav.classList.contains('open');
            this.setAttribute('aria-expanded', isOpen);
            
            const spans = this.querySelectorAll('span');
            if (isOpen) {
                spans.forEach((span, i) => {
                    if (i === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (i === 1) span.style.opacity = '0';
                    if (i === 2) span.style.transform = 'rotate(-45deg) translate(5px, -5px)';
                });
            } else {
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.header__inner')) {
                nav.classList.remove('open');
                toggleBtn.setAttribute('aria-expanded', 'false');
                const spans = toggleBtn.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
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

    // ===== LOAD TIME - CĂN GIỮA, NHỎ HƠN =====
    window.addEventListener('load', function() {
        const loadTime = performance.now().toFixed(2);
        const footerBottom = document.querySelector('.footer__bottom');
        
        if (footerBottom) {
            // Xóa load time cũ nếu có
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