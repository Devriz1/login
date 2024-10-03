// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
    const imageUpload = document.getElementById('imageUpload');
    const uploadButton = document.getElementById('uploadButton');
    const doneButton = document.getElementById('doneButton');
    const imagesContainer = document.getElementById('imagesContainer');

    const githubToken = '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'; // Replace with your token
    const repoOwner = 'devriz1'; // Your GitHub username
    const repoName = 'login'; // The repository to which you want to upload

    let selectedFiles = []; // Array to hold selected files for upload

    // Handle the upload button click
    uploadButton.addEventListener('click', function() {
        const files = imageUpload.files;
        if (files.length === 0) {
            alert("Please select images to upload.");
            return;
        }

        // Clear previous images
        imagesContainer.innerHTML = '';
        selectedFiles = []; // Reset the selected files array

        // Create previews for each selected image
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Create a container for the image
                const imgContainer = document.createElement('div');
                imgContainer.style.display = 'flex';
                imgContainer.style.flexDirection = 'column'; // Stack image and button vertically
                imgContainer.style.alignItems = 'center';
                imgContainer.style.margin = '5px';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                img.style.maxWidth = '100px'; // Set max width for the preview
                img.style.maxHeight = '100px'; // Set max height for the preview
                img.style.objectFit = 'cover'; // Preserve aspect ratio and fill the area
                img.style.borderRadius = '10px'; // Rounded corners

                // Create a remove button
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.style.backgroundColor = '#ff4d4d';
                removeButton.style.color = '#fff';
                removeButton.style.border = 'none';
                removeButton.style.padding = '5px 10px';
                removeButton.style.cursor = 'pointer';
                removeButton.style.borderRadius = '4px';
                removeButton.style.position = 'relative'; // Position relative to float below image
                removeButton.style.marginTop = '5px'; // Space between image and button

                // Add event listener for the remove button
                removeButton.addEventListener('click', function() {
                    imgContainer.remove(); // Remove the image container
                    selectedFiles = selectedFiles.filter(f => f.name !== file.name); // Remove from selected files
                });

                // Append image and button to the container
                imgContainer.appendChild(img);
                imgContainer.appendChild(removeButton);
                imagesContainer.appendChild(imgContainer);
                
                // Add the file to the selected files array
                selectedFiles.push(file);
            };

            reader.readAsDataURL(file);
        });

        // Reset the file input to default
        imageUpload.value = ''; // Clear the file input
    });

    // Handle the done button click
    doneButton.addEventListener('click', function() {
        if (selectedFiles.length === 0) {
            alert("No images to upload.");
            return;
        }

        // Upload each selected file to GitHub
        selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Data = btoa(e.target.result.split(',')[1]);
                const filePath = `/login/images`; // Specify the folder path

                fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${githubToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Upload ${file.name}`,
                        content: base64Data
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to upload image');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Uploaded file:', data);
                    alert('Uploaded: ' + file.name + ' - Link: ' + data.content.html_url);
                })
                .catch(error => {
                    console.error('Error uploading:', error);
                    alert('Upload failed: ' + error.message);
                });
            };

            reader.readAsDataURL(file);
        });

        // Clear the selected files after uploading
        selectedFiles = []; // Clear the array
        imagesContainer.innerHTML = ''; // Clear previews
        imageUpload.value = ''; // Clear the file input
        alert("Upload process completed.");
    });
});
