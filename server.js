var express = require('express')
var app = express();
var PORT = process.env.PORT || 3000;

//Simple get request
app.get('/', function(req, res){
  res.send('TODO api root');
});

app.listen(PORT, function(){
  console.log('listening at port: '+ PORT + ' started...');
});
