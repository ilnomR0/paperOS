const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

const port = parseInt(process.argv[2]);

if (isNaN(port)) {
    console.error("ERROR: port does not equal a number. Please supply a number to proceed");
    process.exit(1);
}

app.use(express.static("frontend"));

const keyPath = path.join(__dirname, 'ssl', 'key.pem');
const certPath = path.join(__dirname, 'ssl', 'cert.pem');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.error("ERROR: SSL certificates not found.");
    console.error(`Expected: ${keyPath} and ${certPath}`);
    process.exit(1);
}

const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

const server = https.createServer(httpsOptions, app);

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});