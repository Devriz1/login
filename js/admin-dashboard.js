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
        const username = 'devriz1'; // Replace with your GitHub username
        const repo = 'login'; // Replace with your repository name
        const path = 'login/images/'; // Folder in the repo where you want to upload images
        const token = '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'; // Use your GitHub personal access token

        images.forEach((img) => {
            const fileName = `${path}${img.name}`;
            const base64Data = img.url.split(',')[1]; // Extract base64 string

            fetch(`https://api.github.com/repos/${username}/${repo}/contents/${fileName}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Upload ${img.name}`,
                    content: base64Data,
                    branch: 'master' // Replace with your branch if different
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to upload image: ' + response.statusText);
                }
            })
            .then(data => {
                console.log('Image uploaded:', data);
                alert(`Successfully uploaded: ${img.name}`);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while uploading: ' + img.name);
            });
        });
    }
});
