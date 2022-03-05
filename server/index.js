const express = require('express');
const app = express();
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const port = 3054;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.static('public'))
app.use(express.json());

var privateKey = fs.readFileSync('./localhost-key.pem');
var certificate = fs.readFileSync('./localhost.pem');

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });

const videos = [
  { id: "0xa4ca3774096d639a7bbaaf5dff3604428704f911", title: "Video #1" },
  { id: "0xb4ca3774096d639a7bbaaf5dff3604428704f9f2", title: "Video #2" },
  { id: "0xc4ca3774096d639a7bbaaf5dff3604428704f9f3", title: "Video #3" },
  { id: "0xd4ca3774096d639a7bbaaf5dff3604428704f9f4", title: "Video #4" },
  { id: "0xe4ca3774096d639a7bbaaf5dff3604428704f9f5", title: "Video #5" },
];

app.get('/', (req, res) => {});

app.get('/videos', (req, res) => {  
  res.send(videos);
});

app.post('/videos', (req, res) => {
    videos.push(req.body);
    res.send(videos);
});

