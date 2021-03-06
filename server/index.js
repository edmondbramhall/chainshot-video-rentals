const express = require('express');
const app = express();
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const port = 3054;

const videoStatus = Object.freeze({
  Unverified: { label: "Unverified", value: 0 },
  Pending: { label: "Pending", value: 1 },
  Accepted: { label: "Accepted", value: 2 },
  Rejected: { label: "Rejected", value: 3 }
});

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.static('public'))
app.use(express.json());

const privateKey = fs.readFileSync('./localhost-key.pem');
const certificate = fs.readFileSync('./localhost.pem');

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });

const videoDB = fs.readFileSync("./videoDB.js");
const videos = JSON.parse(videoDB);

app.get('/', (req, res) => {});

app.get('/videos', (req, res) => {  
  res.send(videos);
});

app.post('/videos', (req, res) => {
  const videoJson = req.body;
  try {
    fs.writeFileSync('./videoDB.js', JSON.stringify(videos));
    videos.push(videoJson);
    res.send(videos);
  } catch (err) {
    console.error(err)
  }  
});

app.put('/videos/:id/status', (req, res) => {
  videos.find(v => v.pinataContent.tokenId.toString() === req.params.id).pinataContent.status = req.body;
  try {
    fs.writeFileSync('./videoDB.js', JSON.stringify(videos));
    res.send(videos);
  } catch (err) {
    console.error(err)
  }  
});

