const jsonServer = require('json-server');
const path = require('path');
const { v4: uuid } = require('uuid');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

const getUsers = () => router.db.get('users');

// GET /users
server.get('/users', (req, res) => {
  const users = getUsers().value();
  res.status(200).json(users);
});

// GET /users/:id
server.get('/users/:id', (req, res) => {
  const user = getUsers().find({ id: req.params.id }).value();
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.status(200).json(user);
});

// POST /users
server.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  const newUser = {
    id: uuid(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  getUsers().push(newUser).write();
  res.status(201).json(newUser);
});

// PUT /users/:id
server.put('/users/:id', (req, res) => {
  const user = getUsers().find({ id: req.params.id }).value();
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const updatedUser = {
    ...user,
    ...req.body,
  };

  getUsers().find({ id: req.params.id }).assign(updatedUser).write();
  res.status(200).json(updatedUser);
});

// DELETE /users/:id
server.delete('/users/:id', (req, res) => {
  const user = getUsers().find({ id: req.params.id }).value();
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  getUsers().remove({ id: req.params.id }).write();
  res.status(204).end();
});

// Start server
const PORT = 3001;
server.use(router);
server.listen(PORT, () => {
  console.log(`🚀 JSON Server running at http://localhost:${PORT}`);
});
