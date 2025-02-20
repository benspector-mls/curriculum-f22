const express = require('express');
const userController = require('./controllers/user/index');
const addModels = require('./middleware/add-models');
const checkAuthentication = require('./middleware/check-authentication');

const Router = express.Router();
Router.use(addModels);

Router.get('/cookieCounter', (req, res) => {
  const { session } = req; // req.session
  console.log(session);

  session.viewCount = (session.viewCount || 0) + 1;
  console.log(session.viewCount);
  res.status(200).send({ count: session.viewCount });
});

const handlePhotos = (req, res) => {
  const { body: { url } } = req; // parsing the req

  console.log(`add ${url} to database`); // doing something with the model

  res.send({ msg: `${url} received!` }); // sending a response
};
Router.post('/photos', handlePhotos);

// Create
Router.post('/users', userController.create);
Router.post('/users/login', userController.login);

// Read
Router.get('/users', userController.list);
Router.get('/users/:id', userController.show);

Router.get('/me', userController.showMe);
// checkAuthentication middleware is applied to only to this route (and /logged-in-secret)
Router.get('/logged-in-secret', checkAuthentication, (req, res) => {
  res.send({ msg: 'The secret is: there is no secret.' });
});

// Update
Router.patch('/users/:id', checkAuthentication, userController.update);

// Delete
Router.delete('/users/logout', userController.logout);

module.exports = Router;
