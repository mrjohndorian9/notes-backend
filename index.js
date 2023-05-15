const express = require('express');
const app = express();
const cors = require('cors');

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true
  }
];

const generateId = () => {
  return notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
};

app.use(express.json());
app.use(express.static('build'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const noteId = Number(req.params.id);
  const note = notes.find(n => noteId === n.id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).send('user not found');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(n => n.id !== id);

  res.status(204).end;
});

app.post('/api/notes', (req, res) => {
  const { body } = req;
  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  };

  notes = notes.concat(note);
  res.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
