const express = require('express')
const app = express()
const port = 10000

app.use(express.static("frontend"));

app.listen(port, (err)=>{
    console.log(`listening on port  ${port}`);
});
