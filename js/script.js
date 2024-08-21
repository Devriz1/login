const VALID_USERNAME = 'Risal';
const VALID_PASSWORD = '123';

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        alert('Login successful!');
        
        window.location.href = 'admin-dashboard.html'; 
    } else {
        errorMessage.textContent = 'Invalid username or password';
    }
});
