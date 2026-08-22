(function() {
    'use strict';

    function initMobileMenu() {
        const toggleBtn = document.getElementById('mobileToggle');
        const nav = document.querySelector('.header__nav');
        const overlay = document.getElementById('menuOverlay');

        if (!toggleBtn || !nav) return;

        const spans = toggleBtn.querySelectorAll('span');
        var isOpen = false;

        function openMenu() {
            nav.classList.add('open');
            if (overlay) overlay.classList.add('active');
            isOpen = true;
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';

            spans.forEach(function(span, i) {
                if (i === 0) {
                    span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                }
                if (i === 1) {
                    span.style.opacity = '0';
                }
                if (i === 2) {
                    span.style.transform = 'rotate(-45deg) translate(5px, -5px)';
                }
            });
        }

        function closeMenu() {
            nav.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
            isOpen = false;
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';

            spans.forEach(function(span) {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }

        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
            }
        });

        document.addEventListener('click', function(e) {
            if (isOpen && !e.target.closest('.header__nav') && !e.target.closest('.header__toggle')) {
                closeMenu();
            }
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && isOpen) {
                closeMenu();
            }
        });
    }

    function highlightActiveMenu() {
        var currentPath = window.location.pathname;
        var menuLinks = document.querySelectorAll('.header__menu-item a');

        menuLinks.forEach(function(link) {
            var href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('load', function() {
        var loadTime = performance.now().toFixed(2);
        var footerBottom = document.querySelector('.footer__bottom');

        if (footerBottom) {
            var oldTime = footerBottom.querySelector('.load-time');
            if (oldTime) oldTime.remove();

            var timeEl = document.createElement('span');
            timeEl.className = 'load-time';
            timeEl.textContent = 'Thời gian tải trang: ' + loadTime + ' ms';
            footerBottom.appendChild(timeEl);
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        highlightActiveMenu();
        console.log('ROYAL TRAVEL: Website ready');
    });

})();