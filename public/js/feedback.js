(function() {
    'use strict';

    const form = document.getElementById('feedback-form');
    const list = document.getElementById('feedback-list');
    const template = document.getElementById('feedback-template');

    if (!form || !list || !template) return;

    const STORAGE_KEY = 'royal_feedbacks';
    let feedbacks = [];

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

    function getStarHTML(rating) {
    const fullStar = '★';
    const emptyStar = '☆';
    if (!rating || rating === 0) {
        return 'Chưa đánh giá';
    }
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += i <= rating ? fullStar : emptyStar;
    }
    return html;
    }

    function loadFromStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    function saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
        } catch {}
    }

    function renderAllFeedbacks() {
        list.innerHTML = '';

        if (feedbacks.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'empty-state';
            empty.innerHTML = '<p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>';
            list.appendChild(empty);
            return;
        }

        const showFeedbacks = feedbacks.slice(-5).reverse();

        showFeedbacks.forEach(function(item) {
            const realIndex = feedbacks.indexOf(item);
            const clone = template.content.cloneNode(true);

            const nameEl = clone.querySelector('.feedback__name');
            const emailEl = clone.querySelector('.feedback__email');
            const ratingEl = clone.querySelector('.feedback__rating-display');
            if (ratingEl) {
                const ratingText = getStarHTML(item.rating || 0);
                ratingEl.textContent = ratingText;
            
            // Thêm class tùy theo có rating hay không
                if (item.rating && item.rating > 0) {
                    ratingEl.classList.add('has-rating');
                    ratingEl.classList.remove('no-rating');
                } else {
                    ratingEl.classList.add('no-rating');
                    ratingEl.classList.remove('has-rating');
                }
            }
            const commentEl = clone.querySelector('.feedback__comment');

            if (nameEl) nameEl.textContent = item.name || 'Khách hàng';
            if (emailEl) emailEl.textContent = maskEmail(item.email) || '';
            if (ratingEl) ratingEl.textContent = getStarHTML(item.rating || 0);
            if (commentEl) commentEl.textContent = item.comment || '';

            const editBtn = clone.querySelector('.btn-edit');
            const deleteBtn = clone.querySelector('.btn-delete');

            if (editBtn) {
                editBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openEditModal(realIndex);
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
                        feedbacks.splice(realIndex, 1);
                        saveToStorage();
                        renderAllFeedbacks();
                    }
                });
            }

            list.appendChild(clone);
        });
    }

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

    function openEditModal(index) {
        const item = feedbacks[index];
        if (!item) return;

        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="edit-modal-content">
                <h3>Sửa đánh giá</h3>
                <div class="form-group">
                    <label>Đánh giá sao</label>
                    <div class="star-rating edit-star-rating">
                        ${getStarRatingHTML(item.rating || 0)}
                    </div>
                </div>
                <div class="form-group">
                    <label>Ý kiến đánh giá</label>
                    <textarea id="edit-comment" rows="4">${item.comment || ''}</textarea>
                </div>
                <div class="edit-modal-actions">
                    <button class="btn btn-primary" id="save-edit">Lưu</button>
                    <button class="btn btn-outline" id="cancel-edit">Hủy</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('#save-edit').addEventListener('click', function() {
            const checked = modal.querySelector('input[name="edit-rating"]:checked');
            const rating = checked ? parseInt(checked.value) : 0;
            const comment = modal.querySelector('#edit-comment').value.trim();

            if (!comment) {
                alert('Vui lòng nhập nội dung đánh giá.');
                return;
            }

            feedbacks[index].rating = rating;
            feedbacks[index].comment = comment;
            saveToStorage();
            renderAllFeedbacks();
            modal.remove();
        });

        modal.querySelector('#cancel-edit').addEventListener('click', function() {
            modal.remove();
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const comment = form.comment.value.trim();
        const ratingInput = form.querySelector('input[name="rating"]:checked');
        const rating = ratingInput ? parseInt(ratingInput.value) : 0;

        if (!name) {
            alert('Vui lòng nhập họ tên.');
            form.name.focus();
            return;
        }

        if (!email) {
            alert('Vui lòng nhập email.');
            form.email.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Vui lòng nhập email hợp lệ.');
            form.email.focus();
            return;
        }

        if (!comment) {
            alert('Vui lòng nhập nội dung đánh giá.');
            form.comment.focus();
            return;
        }

        const newFeedback = {
            name: name,
            email: email,
            rating: rating,
            comment: comment,
            createdAt: new Date().toISOString()
        };

        feedbacks.push(newFeedback);
        saveToStorage();
        renderAllFeedbacks();
        form.reset();

        const stars = form.querySelectorAll('.star-rating input');
        stars.forEach(function(s) { s.checked = false; });

        showNotification('Cảm ơn bạn đã gửi đánh giá!');
    });

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #0a1628;
            color: #c9a84c;
            padding: 16px 28px;
            border-radius: 12px;
            z-index: 9999;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            border: 1px solid rgba(201, 168, 76, 0.3);
            animation: slideInRight 0.3s ease;
            font-weight: 500;
            max-width: 400px;
        `;
        document.body.appendChild(notification);

        setTimeout(function() {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(function() { notification.remove(); }, 300);
        }, 3000);
    }

    var style = document.createElement('style');
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

    feedbacks = loadFromStorage();
    renderAllFeedbacks();

    console.log('Feedback: Da tai ' + feedbacks.length + ' danh gia');
})();