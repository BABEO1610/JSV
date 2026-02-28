const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const data = JSON.stringify({
  title: 'Test Title',
  content: 'Test Description',
  description: 'Test Description',
  location: 'Test Location'
});

console.log('Sending request...');
console.log('Data:', data);

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response received:');
    console.log(responseData);
    console.log('---');
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
