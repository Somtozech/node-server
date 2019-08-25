const shortid = require('shortid');

class UserModel {
  constructor(user) {
    this.id = shortid.generate();
    this.name = user.name;
    this.email = user.email;
    this.occupation = user.occupation;
    this.state = user.state;
    this.country = user.country;
  }
}

module.exports = UserModel;
