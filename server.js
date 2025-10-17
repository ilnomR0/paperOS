const express = require('express');
const app = express();
const port = parseInt(process.argv[2]);

if(isNaN(port)){
    console.error("ERROR: port does not equal a number. Please supply a number to proceed");
    return 1;
}

app.use(express.static("frontend"));

app.listen(port, (err)=>{
    console.log(`listening on port  ${port}`);
});
