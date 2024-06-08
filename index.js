const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));


let tasks = [
  { id: 1, text: 'Task 1' },
  { id: 2, text: 'Task 2' }
];

// Функция для генерации уникальных ID
function generateId() {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const newId = generateId();
  const newTask = { id: newId, text: req.body.task };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  tasks = tasks.filter(task => task.id !== id);
  res.status(204).send();
});

app.get('/save', (req, res) => {
  const newId = generateId();
  const data = {
    name: 'TodoList',
    id: newId,
    tasks: tasks,
    msg: 'Hi! It is the save file for todo list, you see all date for this .json file. Go to the /download for download the file'
  };

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file', err);
      return res.status(500).json({ error: 'Failed to write to file' });
    }
    res.json(data);
  });
});

app.get('/download', (req, res) => {
  const file = path.join(__dirname, 'data.json');
  res.download(file, 'data.json', (err) => {
    if (err) {
      console.error('Error downloading file', err);
      res.status(500).send('Error downloading file');
    }
  });
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
