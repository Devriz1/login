document.addEventListener('DOMContentLoaded', function() {
  const uploadButton = document.getElementById('uploadButton');
  const doneButton = document.getElementById('doneButton');
  const imageUpload = document.getElementById('imageUpload');
  const imagesContainer = document.getElementById('imagesContainer');

  let images = []; // Array to store image data

  // Import the MEGA JavaScript SDK
  import { Storage } from 'megajs';

  // Create a new instance of the MEGA Storage object
  const storage = new Storage({
    email: 'risalrichu01@gmail.com',
    password: 'Sainudheen@01'
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
      images.forEach((img) => {
        const file = new File([img.url], img.name, {
          type: img.type
        });

        storage.upload(file).then((uploadResponse) => {
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
