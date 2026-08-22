document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper chưa được load.');
        return;
    }

    const sliderElement = document.querySelector('.banner__slider');
    if (!sliderElement) {
        console.warn('Không tìm thấy .banner__slider');
        return;
    }

    try {
        const swiper = new Swiper('.banner__slider', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: false,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            speed: 800,
            grabCursor: true,
        });

        console.log('Swiper đã khởi tạo thành công!');
    } catch (error) {
        console.error('Lỗi khởi tạo Swiper:', error);
    }
});