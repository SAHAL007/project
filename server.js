// server.js
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const connection = require('./db');  // MySQL connection

// Serve HTML files
const serveFile = (res, filePath) => {
    console.log('serving file')
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log('serving file error', err)
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('File Not Found');
            res.end();
            return;
        }
        console.log('serving file : ', res)
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
    });
};

const requestHandler = (req, res) => {
  const parsedUrl = url.parse(req.url);
  const path = parsedUrl.pathname;

  // Handle requests for HTML files
  if (path === '/') {
    console.log('serving file request: ', path)
    serveFile(res, './index.html');
  } else if (path === '/login.html') {
    console.log('serving file request: ', path)
    serveFile(res, './login.html');
  } else if (path === '/register.html') {
    console.log('serving file request: ', path)
    serveFile(res, './register.html');
  }

  // Serve static files
  else if (path.endsWith('.css') || path.endsWith('.js')) {
    const filePath = `.${path}`;
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('File Not Found');
        res.end();
        return;
      }
      res.writeHead(200, { 'Content-Type': getContentType(path) });
      res.write(data);
      res.end();
    });
  }

  // Handle requests to register a new user
  else if (path === '/register' && req.method === 'POST') {
    console.log('serving file request: ', path)
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { username, password } = querystring.parse(body);
      const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
      connection.query(query, [username, password], (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.write('Error saving user');
          res.end();
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('User registered successfully');
        res.end();
      });
    });
  }

  // Handle requests to login a user
  else if (path === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { username, password } = querystring.parse(body);
      console.log('username', username);
      const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
      connection.query(query, [username, password], (err, results) => {
        if (err || results.length === 0) {
          res.writeHead(401, { 'Content-Type': 'text/plain' });
          res.write('Invalid username or password');
          res.end();
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('Login successful');
        res.end();
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Page not found');
    res.end();
    console.log('serving file request: 404 ', res)
  }
};

// Helper function to get the content type based on the file extension
const getContentType = (path) => {
  if (path.endsWith('.css')) return 'text/css';
  if (path.endsWith('.js')) return 'application/javascript';
  return 'text/plain';
};

// Create HTTP server
const server = http.createServer(requestHandler);

// Start server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
