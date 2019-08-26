const Validation = require('../helper/validate');
const Database = require('../lib/db');
const User = require('../lib/model');

class UserController {
  /**
   * Creates a new user if request comes with a valid body or payload
   * @param {Object} request - api request
   * @param {Object} response - router response
   */
  create(request, response) {
    let data = '';
    request.on('data', chunk => {
      data += chunk.toString();
    });

    request.on('end', async () => {
      const body = JSON.parse(data);
      //make sure request body contains all required key for a user
      const validateBody = Validation.checkBodyContains(
        body,
        'name',
        'email',
        'occupation',
        'state',
        'country'
      );

      // make sure values in the request body are not null or empty
      const validateNullOrEmpty = Validation.checkValuesNullorEmpty(
        body,
        'name',
        'email',
        'occupation',
        'state',
        'country'
      );

      const stringRegex = /^\w+$/;

      //make sure the body contains valid values
      const validateValidBody = Validation.checkValuesValid(
        body,
        { name: 'name', regex: stringRegex },
        {
          name: 'email',
          regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        {
          name: 'occupation',
          regex: stringRegex
        },
        {
          name: 'state',
          regex: stringRegex
        },
        {
          name: 'country',
          regex: stringRegex
        }
      );

      const errors = validateBody || validateNullOrEmpty || validateValidBody;

      if (errors) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ errors }));
        response.end();
        return;
      }

      //model a new user
      const user = new User(body);
      Database.create(user)
        .then(() => {
          //if user creation was successful

          response.writeHead(201, { 'Content-Type': 'application/json' });
          response.end(
            JSON.stringify({
              message: 'User successfully created',
              user
            })
          );
        })
        .catch(error => {
          //if error occurs during user creation
          response.writeHead(500, { 'Content-Type': 'application/json' });
          response.end(
            JSON.stringify({
              message: 'An Error Occured',
              error
            })
          );
        });
    });
  }

  /**
   * get a user based on the id provided in the query
   * @param {Object} request - api request
   * @param {Object} response - router response
   */
  getUser(request, response) {
    const { id } = request.query;

    if (!id) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          message: 'Expects a valid user id in the query'
        })
      );
      return;
    }

    Database.get(id)
      .then(user => {
        if (!user) {
          response.writeHead(404, { 'Content-Type': 'application/json' });
          response.end(
            JSON.stringify({
              message: `User not found`
            })
          );
        }
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(user));
      })
      .catch(error => {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message: 'An Error Occured',
            error
          })
        );
      });
  }

  /**
   * updates a user based on the id from the query
   * @param {Object} request - api request
   * @param {Object} response - router response
   */
  update(request, response) {
    const { id } = request.query;
    if (!id) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      return response.end(
        JSON.stringify({
          message: 'Expects a valid user id in the query'
        })
      );
    }

    let data = '';
    request.on('data', chunk => (data += chunk.toString()));
    request.on('end', () => {
      let body = JSON.parse(data);
      const validFields = ['name', 'email', 'occupation', 'state', 'country'];
      //remove invalid fields in the body
      for (let i in body) {
        if (!validFields.includes(i)) {
          delete body[i];
        }
      }

      const validateEmail = Validation.checkValuesValid(body, {
        name: 'email',
        regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      });

      const errors =
        Validation.checkValuesNullorEmpty(body, ...Object.keys(body)) ||
        validateEmail;
      if (errors) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ errors }));
        return response.end();
      }

      Database.update(id, body)
        .then(user => {
          if (!user) {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(
              JSON.stringify({
                message: `User not found`
              })
            );
          }
          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify(user));
        })
        .catch(error => {
          response.writeHead(500, { 'Content-Type': 'application/json' });
          response.end(
            JSON.stringify({
              message: 'An Error Occured',
              error
            })
          );
        });
    });
  }

  /**
   * Deletes a valid user
   * @param {Object} request - api request
   * @param {Object} response - router response
   */
  deleteUser(request, response) {
    const { id } = request.query;

    if (!id) {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      return response.end(
        JSON.stringify({
          message: 'Expects a valid user id in the query'
        })
      );
    }

    Database.delete(id)
      .then(() => {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message: 'User deletion was successful'
          })
        );
      })
      .catch(error => {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message: 'An Error Occured',
            error
          })
        );
      });
  }

  //get all users
  getAllUsers(request, response) {
    Database.read()
      .then(users => {
        const values = Object.values(users);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(values));
      })
      .catch(error => {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message: 'An Error Occured',
            error
          })
        );
      });
  }
}

module.exports = new UserController();
