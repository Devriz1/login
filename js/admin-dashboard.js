document.addEventListener('DOMContentLoaded', function() {
    const uploadButton = document.getElementById('uploadButton');
    const doneButton = document.getElementById('doneButton');
    const imageUpload = document.getElementById('imageUpload');
    const imagesContainer = document.getElementById('imagesContainer');

    let images = []; // Array to store image data

    // Initialize MEGA Storage
    const storage = new mega.Storage({
        email: risalrichu01@gmail.com  // Replace with your email
        password: Sainudheen@01          // Replace with your password
    });

    // Wait for the storage object to be ready
    storage.ready.then(() => {
        // Handle image upload
        uploadButton.addEventListener('click', function(event) {
            event.preventDefault();
            const files = imageUpload.files;
            if (files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imgData = {
                            url: e.target.result,
                            name: file.name,
                            type: file.type
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

        // Function to delete an image
        window.deleteImage = function(index) {
            if (confirm('Are you sure you want to delete this image?')) {
                images.splice(index, 1);
                displayImages();
            }
        };

        // Function to finalize upload
        function finalizeUpload() {
            images.forEach((img) => {
                // Convert base64 to Blob
                const byteString = atob(img.url.split(',')[1]);
                const mimeString = img.type;
                const ab = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    ab[i] = byteString.charCodeAt(i);
                }
                const fileBlob = new Blob([ab], { type: mimeString });
                
                // Upload the Blob as a file
                storage.upload(fileBlob, img.name).then((uploadResponse) => {
                    console.log('Image uploaded:', uploadResponse);
                    alert(`Successfully uploaded: ${img.name}`);
                }).catch((error) => {
                    console.error('Error:', error);
                    alert('An error occurred while uploading: ' + img.name);
                });
            });
        }

        // Handle Done button click
        doneButton.addEventListener('click', function(event) {
            event.preventDefault();
            finalizeUpload();
        });
    }).catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while initializing MEGA storage');
    });
});
