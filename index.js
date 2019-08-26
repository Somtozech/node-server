const app = require('./lib/server');
const port = process.env.PORT || 3000;

const UserController = require('./controller/user');

// get a user with an id in the query
app.get('/user', UserController.getUser);

//get all users
app.get('/users', UserController.getAllUsers);

//create a new user
app.post('/user', UserController.create);

//update user
app.put('/user', UserController.update);

//delete user
app.delete('/user', UserController.deleteUser);

app.listen(port, () => {
  console.log(`Server Listening at port ${port}`);
});
