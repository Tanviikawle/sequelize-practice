const express = require('express');
const User = require('./models/user');

const app = express();
app.use(express.json()); 

app.post('/users', async (req, res) => {
  try {
    const newUser = await User.create({
      email: req.body.email, 
      username: req.body.username, 
      age: req.body.age,
      status: req.body.status
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const messages = error.errors.map((err) => err.message);
      res.status(400).json({ errors: messages });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
