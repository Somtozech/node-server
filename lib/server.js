const { createServer } = require('http');
const Router = require('./router');

const methods = ['get', 'post', 'put', 'delete', 'patch'];

class Server {
  constructor() {
    this.router = new Router();

    methods.forEach(method => {
      this[method] = function(path, cb) {
        this.router.route(method, path, cb);
      };
    });
  }
  /**
   * Listen to server connections
   * @param {Number} port - Port to listen for connections
   * @param {Function} cb
   * @returns  {http.Server}
   */
  listen(port, cb) {
    const server = createServer((req, res) => this.router.handle(req, res));
    return server.listen(port, cb);
  }
}

module.exports = new Server();
