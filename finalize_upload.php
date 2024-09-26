<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $images = $data['images'];

    // Your GitHub upload logic would go here
    // Consider using this PHP file if you're handling uploads on your server instead
} else {
    echo "Invalid request method.";
}
?>
