const express = require("express");
const ack = require("./ack.json");
const app = express();
app.use(express.json());

let port = 3400;
app.listen(port, () => {
    console.log('This app is running on port number : ', port);
  });

  app.post('/:api',(req,res)=>{
  console.log(`received ${req.params.api} request`);
    console.log(req.body);
    res.json(ack);
  })