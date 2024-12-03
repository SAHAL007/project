document.addEventListener('DOMContentLoaded', function() {
  // Register Form Submission
  console.log(document.getElementById('loginForm'))
  if(document.getElementById('registerForm')!=null){
      document.getElementById('registerForm').addEventListener('submit', function (e) {
        console.log('submission for register: ',e);
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `username=${username}&password=${password}`
        })
        .then(response => response.text())
        .then(data => alert(data));
      });
  }

  // Login Form Submission
  else {
        console.log('login submitted')
      document.getElementById('loginForm').addEventListener('submit', function (e) {
        console.log('submission for login: ',e);
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `username=${username}&password=${password}`
        })
        .then(response => response.text())
        .then(data => alert(data));
      });
  }
});
