(function() {
    'use strict';

    const form = document.getElementById('feedback-form');
    const list = document.getElementById('feedback-list');
    const template = document.getElementById('feedback-template');

    if (!form || !list || !template) {
        console.warn('Feedback: Không tìm thấy các element cần thiết');
        return;
    }

    const STORAGE_KEY = 'royal_feedbacks';
    let feedbacks = [];

    // Hàm ẩn email
    function maskEmail(email) {
        if (!email) return '';
        const parts = email.split('@');
        if (parts.length !== 2) return email;
        const name = parts[0];
        const domain = parts[1];
        if (name.length <= 2) return email;
        const masked = name.substring(0, 2) + '****' + name.substring(name.length - 1);
        return masked + '@' + domain;
    }

    // Tạo chuỗi sao
    function getRatingStars(rating) {
        const fullStar = '★';
        const emptyStar = '☆';
        return fullStar.repeat(rating || 0) + emptyStar.repeat(5 - (rating || 0));
    }

    // Tạo HTML cho star rating trong form edit
    function getStarRatingHTML(rating) {
        let html = '';
        for (let i = 5; i >= 1; i--) {
            const checked = i === rating ? 'checked' : '';
            html += `
                <input type="radio" name="edit-rating" value="${i}" id="edit-star${i}" ${checked}>
                <label for="edit-star${i}">★</label>
            `;
        }
        return html;
    }

    function loadFromStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
        } catch (e) {}
    }

    function renderFeedbackItem(item, index) {
        const clone = template.content.cloneNode(true);
        
        const nameEl = clone.querySelector('.feedback__name');
        const emailEl = clone.querySelector('.feedback__email');
        const commentEl = clone.querySelector('.feedback__comment');
        const ratingEl = clone.querySelector('.feedback__rating');
        
        if (nameEl) nameEl.textContent = item.name;
        if (emailEl) emailEl.textContent = maskEmail(item.email);
        if (commentEl) commentEl.textContent = item.comment;
        if (ratingEl) ratingEl.textContent = getRatingStars(item.rating || 0);

        // Nút Sửa - MỞ HỘP THOẠI CHO PHÉP SỬA CẢ SAO
        const editBtn = clone.querySelector('.btn-edit');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                // Tạo hộp thoại tùy chỉnh
                const modal = document.createElement('div');
                modal.className = 'edit-modal';
                modal.innerHTML = `
                    <div class="edit-modal-content">
                        <h3>Sửa đánh giá</h3>
                        <div class="form-group">
                            <label>Ý kiến đánh giá</label>
                            <textarea id="edit-comment" rows="4">${item.comment}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Đánh giá sao</label>
                            <div class="star-rating edit-star-rating">
                                ${getStarRatingHTML(item.rating || 0)}
                            </div>
                        </div>
                        <div class="edit-modal-actions">
                            <button class="btn btn-primary" id="save-edit-btn">Lưu thay đổi</button>
                            <button class="btn btn-outline" id="cancel-edit-btn">Hủy</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                // Đóng modal khi click ra ngoài
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });

                // Xử lý lưu
                const saveBtn = modal.querySelector('#save-edit-btn');
                const cancelBtn = modal.querySelector('#cancel-edit-btn');
                const commentInput = modal.querySelector('#edit-comment');
                const ratingInput = modal.querySelector('input[name="edit-rating"]:checked');

                saveBtn.addEventListener('click', function() {
                    const newComment = commentInput.value.trim();
                    const newRating = modal.querySelector('input[name="edit-rating"]:checked');
                    
                    if (!newComment) {
                        alert('Vui lòng nhập nội dung đánh giá.');
                        return;
                    }

                    feedbacks[index].comment = newComment;
                    if (newRating) {
                        feedbacks[index].rating = parseInt(newRating.value);
                    }
                    
                    saveToStorage();
                    renderAllFeedbacks();
                    modal.remove();
                });

                cancelBtn.addEventListener('click', function() {
                    modal.remove();
                });

                // Enter để lưu
                commentInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && e.ctrlKey) {
                        saveBtn.click();
                    }
                });
            });
        }

        // Nút Xóa
        const deleteBtn = clone.querySelector('.btn-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
                    feedbacks.splice(index, 1);
                    saveToStorage();
                    renderAllFeedbacks();
                }
            });
        }

        list.appendChild(clone);
    }

    function renderAllFeedbacks() {
        list.innerHTML = '';
        
        if (feedbacks.length === 0) {
            const emptyMsg = document.createElement('li');
            emptyMsg.className = 'empty-state';
            emptyMsg.innerHTML = '<p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>';
            list.appendChild(emptyMsg);
            return;
        }

        feedbacks.forEach((item, index) => {
            renderFeedbackItem(item, index);
        });
    }

    // Submit form
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = form.name?.value?.trim() || '';
        const email = form.email?.value?.trim() || '';
        const comment = form.comment?.value?.trim() || '';
        
        const ratingInput = form.querySelector('input[name="rating"]:checked');
        const rating = ratingInput ? parseInt(ratingInput.value) : 0;

        if (!name) {
            alert('Vui lòng nhập họ tên.');
            return;
        }

        if (!email) {
            alert('Vui lòng nhập email.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Vui lòng nhập email hợp lệ.');
            return;
        }

        if (!comment) {
            alert('Vui lòng nhập nội dung đánh giá.');
            return;
        }

        const newFeedback = { 
            name, 
            email, 
            comment, 
            rating: rating,
            createdAt: new Date().toISOString() 
        };
        
        feedbacks.unshift(newFeedback);
        saveToStorage();
        renderAllFeedbacks();
        form.reset();

        const stars = form.querySelectorAll('.star-rating input');
        stars.forEach(star => star.checked = false);

        alert('Cảm ơn bạn đã gửi đánh giá!');
    });

    feedbacks = loadFromStorage();
    renderAllFeedbacks();

    console.log(`Feedback: Đã tải ${feedbacks.length} đánh giá`);
})();