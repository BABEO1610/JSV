const http = require('http');

const data = JSON.stringify({
  title: 'Test Activity',
  description: 'Test Description',
  location: 'Hanoi',
  maxParticipants: 10,
  duration: 120,
  userId: 2
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
