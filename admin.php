<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $images = $data['images'];

    $token = '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';
    $repo = 'Devriz1/login';
    $branch = 'master'; // or your desired branch

    foreach ($images as $image) {
        $base64Image = base64_encode(file_get_contents($image['url']));
        $filePath = 'images/' . basename($image['name']); // Store in an 'images' folder

        $url = "https://api.github.com/repos/$repo/contents/$filePath";
        $postData = [
            'message' => 'Upload image ' . basename($image['name']),
            'content' => $base64Image,
            'branch' => $branch
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: token ' . $token,
            'User-Agent: YourAppName',
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

        $response = curl_exec($ch);
        curl_close($ch);

        // Optionally handle the response here (e.g., log success/failure)
    }

    echo "Images uploaded successfully!";
} else {
    echo "Invalid request method.";
}
?>
