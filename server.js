var express = require('express');
var bodyparser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoId;
var todoNextId = 1;

app.use(bodyparser.json())

//root
app.get('/', function(req, res){
  res.send('TODO api root');
});

//GET all the todos
app.get('/todos', function(req, res){
  res.json(todos);
})

//GET todo by id
app.get('/todos/:id', function(req, res){
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo;
  todos.forEach(function(todo){
    if(todo.id === todoId){
      matchedTodo = todo;
    }
  });

  if (matchedTodo) {
    res.json(matchedTodo);
  }else{
    res.status(404).send;
  }

});

//POST todos
app.post('/todos', function(req, res){
  var body = req.body;

  //add id field
  body.id = todoNextId++;

  //push id into array
  todos.push(body);  

  res.json(body);
});

app.listen(PORT, function(){
  console.log('listening at port: '+ PORT + ' started...');
});
