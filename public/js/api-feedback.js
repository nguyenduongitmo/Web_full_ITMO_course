(function() {
    'use strict';

    const CONFIG = {
        API_URL: 'https://jsonplaceholder.typicode.com/comments',
        ITEMS_PER_PAGE: 5,
        MAX_POST_ID: 100,
        MIN_POST_ID: 1,
    };

    const elements = {
        list: document.getElementById('api-feedback-list'),
        preloader: document.getElementById('api-preloader'),
        error: document.getElementById('api-error'),
        template: document.getElementById('api-feedback-template'),
        reloadBtn: document.getElementById('reload-api-btn')
    };

    if (!elements.list) {
        console.warn('API Feedback: Không tìm thấy element api-feedback-list');
        return;
    }

    let currentPostId = 1;
    let isLoading = false;

    function getRandomPostId() {
        return Math.floor(Math.random() * (CONFIG.MAX_POST_ID - CONFIG.MIN_POST_ID + 1)) + CONFIG.MIN_POST_ID;
    }

    function setLoading(state) {
        isLoading = state;
        if (elements.preloader) {
            elements.preloader.style.display = state ? 'block' : 'none';
        }
        if (elements.error) {
            elements.error.style.display = 'none';
        }
        if (elements.reloadBtn) {
            elements.reloadBtn.disabled = state;
            elements.reloadBtn.textContent = state ? 'Đang tải...' : 'Tải thêm đánh giá';
        }
    }

    function showError(message) {
        if (elements.error) {
            elements.error.innerHTML = `<strong>Lỗi:</strong> ${message}`;
            elements.error.style.display = 'block';
        }
    }

    function getRatingStars(rating) {
        const fullStar = '★';
        const emptyStar = '☆';
        return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
    }

    async function fetchFeedback() {
        if (isLoading) return;

        try {
            setLoading(true);
            
            if (elements.list) {
                elements.list.innerHTML = '';
            }

            currentPostId = getRandomPostId();
            const url = `${CONFIG.API_URL}?postId=${currentPostId}&_limit=${CONFIG.ITEMS_PER_PAGE}`;

            console.log(`Đang tải đánh giá cho postId: ${currentPostId}`);

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                showError(`Không tìm thấy đánh giá cho bài viết #${currentPostId}. Hãy thử lại!`);
                return;
            }

            displayFeedback(data);

        } catch (error) {
            let errorMessage = 'Không thể tải dữ liệu. ';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.';
            } else if (error.message.includes('HTTP 404')) {
                errorMessage += 'API không khả dụng.';
            } else {
                errorMessage += error.message;
            }
            
            showError(errorMessage);
            console.error('API Error:', error);
        } finally {
            setLoading(false);
        }
    }

    function displayFeedback(feedbacks) {
        if (!elements.template || !elements.list) return;

        feedbacks.forEach(item => {
            const clone = elements.template.content.cloneNode(true);
            
            const nameEl = clone.querySelector('.api-name');
            const emailEl = clone.querySelector('.api-email');
            const bodyEl = clone.querySelector('.api-body');
            const postIdEl = clone.querySelector('.api-post-id span');

            if (nameEl) nameEl.textContent = item.name;
            if (emailEl) emailEl.textContent = item.email;
            if (bodyEl) bodyEl.textContent = item.body;
            if (postIdEl) postIdEl.textContent = item.postId;

            // Thêm rating ngẫu nhiên cho API feedback
            const randomRating = Math.floor(Math.random() * 5) + 1;
            const ratingEl = clone.querySelector('.api-rating');
            if (ratingEl) {
                ratingEl.textContent = getRatingStars(randomRating);
            }

            elements.list.appendChild(clone);
        });
    }

    window.retryLoad = function() {
        fetchFeedback();
    };

    document.addEventListener('DOMContentLoaded', function() {
        fetchFeedback();

        if (elements.reloadBtn) {
            elements.reloadBtn.addEventListener('click', fetchFeedback);
        }
    });

    window.addEventListener('online', function() {
        if (elements.error && elements.error.style.display !== 'none') {
            fetchFeedback();
        }
    });

    console.log('API Feedback: Đã sẵn sàng');
})();