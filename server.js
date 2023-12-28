const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  console.log('Received message from client');
  res.send('Hello from Express server');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});