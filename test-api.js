const http = require('http');

const postData = JSON.stringify({
  title: "Test Activity CSS",
  content: "Test Description",
  location: "Hanoi",
  maxParticipants: 10,
  duration: 120
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(postData);
req.end();
