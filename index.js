const app = require('./lib/server');
const port = process.env.PORT || 3000;

app.get('/create', (request, response) => {
  console.log('getting create');
  response.writeHead(200, { 'Content-Type': 'application/json' });
  return response.write(JSON.stringify({ Message: 'This is a get request' }));
});

app.post('/create', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify({ Message: 'This is a post request' }));
});

app.put('/create', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify({ Message: 'This is an update request' }));
});

app.delete('/create', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify({ Message: 'This is a delete request' }));
});

app.listen(port, () => {
  console.log(`Server Listening at port ${port}`);
});
