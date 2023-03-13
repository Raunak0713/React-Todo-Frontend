const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://Raunak:Raunak2003@cluster0.spm5oss.mongodb.net/?retryWrites=true&w=majority", {
	useNewUrlParser: true, 
	useUnifiedTopology: true 
}).then(() => console.log("Connected to MongoDB")).catch(console.error);

// Models
const Todo = require('./models/Todo');

app.get('/todos', async (req, res) => {
	const todos = await Todo.find();

	res.json(todos);
});

app.post('/todo/new', (req, res) => {
	const todo = new Todo({
		text: req.body.text
	})

	todo.save();

	res.json(todo);
});

app.delete('/todo/delete/:id', async (req, res) => {
	const result = await Todo.findByIdAndDelete(req.params.id);

	res.json({result});
});

app.get('/todo/complete/:id', async (req, res) => {
	try {
	  const todo = await Todo.findById(req.params.id);
  
	  if (!todo) {
		return res.status(404).json({ message: 'Todo not found' });
	  }
  
	  todo.complete = !todo.complete;
  
	  await todo.save();
  
	  res.json(todo);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Internal server error' });
	}
  });
  

app.put('/todo/update/:id', async (req, res) => {
	const todo = await Todo.findById(req.params.id);

	todo.text = req.body.text;

	todo.save();

	res.json(todo);
});

app.listen(3001);
