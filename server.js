const express = require('express');
const app = express();
const port = 4331;

app.use(express.static("frontend"));

app.listen(port, (err)=>{
    console.log(`listening on port  ${port}`);
});
