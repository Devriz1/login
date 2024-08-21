// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    const uploadButton = document.getElementById('uploadButton');
    const doneButton = document.getElementById('doneButton');
    const imageUpload = document.getElementById('imageUpload');
    const imagesContainer = document.getElementById('imagesContainer');

    let images = []; // Array to store image data

    // Handle image upload
    uploadButton.addEventListener('click', function() {
        const files = imageUpload.files;
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgData = {
                        url: e.target.result,
                        name: file.name
                    };
                    images.push(imgData);
                    displayImages();
                };
                reader.readAsDataURL(file);
            }
            imageUpload.value = ''; // Clear the file input
        } else {
            alert('Please select at least one image file to upload.');
        }
    });

    // Handle Done button click
    doneButton.addEventListener('click', function() {
        finalizeUpload();
    });

    // Function to display images
    function displayImages() {
        imagesContainer.innerHTML = '';
        images.forEach((img, index) => {
            const imageItem = document.createElement('div');
            imageItem.classList.add('image-item');
            imageItem.innerHTML = `
                <img src="${img.url}" alt="${img.name}">
                <button onclick="deleteImage(${index})">Delete</button>
            `;
            imagesContainer.appendChild(imageItem);
        });
    }

    // Function to delete an image with confirmation
    window.deleteImage = function(index) {
        if (confirm('Are you sure you want to delete this image?')) {
            images.splice(index, 1);
            displayImages();
        }
    };

    // Function to finalize upload
    function finalizeUpload() {
        if (images.length === 0) {
            alert('No images to finalize.');
            return;
        }

        fetch('finalize_upload.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ images: images })
        })
        .then(response => response.text())
        .then(result => {
            alert(result);
            // Optionally clear the images array and container
            images = [];
            displayImages();
        })
        .catch(error => {
            console.error('Error finalizing upload:', error);
            alert('Failed to finalize upload.');
        });
    }
});
