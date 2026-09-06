document.addEventListener('DOMContentLoaded', function() {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('tourImage');
    const imageUrl = document.getElementById('imageUrl');
    const preview = document.getElementById('previewImage');
    const previewContainer = document.getElementById('previewContainer');

    if (!uploadBtn) return;

    uploadBtn.addEventListener('click', async function() {
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Vui lòng chọn file ảnh!');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File quá lớn! Chỉ chấp nhận dưới 5MB.');
            return;
        }

        // Hiển thị preview
        const reader = new FileReader();
        reader.onload = function(e) {
            if (preview) {
                preview.src = e.target.result;
                previewContainer.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);

        // Upload
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'tours');

        try {
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                imageUrl.value = result.url;
                alert('Upload thành công!');
            } else {
                alert('Upload thất bại: ' + (result.message || 'Lỗi'));
            }
        } catch (error) {
            alert('Lỗi: ' + error.message);
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Upload';
        }
    });
});