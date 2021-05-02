//import
const http = require('http');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

//promiseAPI
function promiseAPI(url) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'GET',
      responseType: 'stream',
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

const server = http.createServer((req, res) => {
  //access the / route
  if (req.url == '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      if (err) throw error;

      res.writeHead(200, { 'content-Type': 'text/html' });
      res.end(content);
    });
  }

  //access the api for JSON data REST api
  if (req.url == '/savejson') {
    const url = 'http://jsonplaceholder.typicode.com/posts';
    res.writeHead(200, { 'content-Type': 'application/json', route: req.url });
    promiseAPI(url).then((data) => {
      data.pipe(fs.createWriteStream('./result/posts.json'));
      data.pipe(res);
    });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
