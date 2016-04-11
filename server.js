var express = require('express');
var bodyparser = require('body-parser');
var _ = require('underscore');

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
  var queryParams = req.query;
  var filteredTodos = todos;

  if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
    filteredTodos = _.where(filteredTodos, {completed: true});
  }else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
    filteredTodos = _.where(filteredTodos, {'completed': false});
  }

  res.json(filteredTodos);
})

//GET todo by id
app.get('/todos/:id', function(req, res){
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if (matchedTodo) {
    res.json(matchedTodo);
  }else{
    res.status(404).send();
  }

});

//POST todos
app.post('/todos', function(req, res){
  var body = _.pick(req.body, 'description', 'completed');

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ) {
      return res.status(400).send();
  }

  body.description = body.description.trim();

  //add id field
  body.id = todoNextId++;

  //push id into array
  todos.push(body);

  res.json(body);
});

//DELETE todo by id
app.delete('/todos/:id', function(req, res){
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if(!matchedTodo){
    res.status(404).json({"error": "no todo founf with that id"});
  }else{
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
  }
});

//PUT (update) todo by id
app.put('/todos/:id', function(req, res){
  //find the todo object that you want to update
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  var body = _.pick(req.body, "description", "completed");
  var validAttributes = {};

  if(!matchedTodo){
    return res.status(404).send();
  }

  //validate the completed attribute
  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
    validAttributes.completed = body.completed;
  }else if(body.hasOwnProperty('completed')){
    return res.status(400).send();
  }

  //validate the description attribute
  if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
    validAttributes.description = body.description;
  }else if(body.hasOwnProperty('description')){
    return res.status(400).send();
  }

  _.extend(matchedTodo, validAttributes)

  res.json(matchedTodo);
});

app.listen(PORT, function(){
  console.log('listening at port: '+ PORT + ' started...');
});
