const { parse } = require('url');

class Router {
  constructor() {
    this.routes = [];
    this.request = {};
    this.defaultRoute = {
      callback: (request, response) => {
        response.writeHead(404);
        response.write(JSON.stringify({ message: 'Not Found' }));
      }
    };
  }

  /**
   * Handle all incoming requests and send out appropriate response
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   */
  handle(req, res) {
    const parsed = parse(req.url, true);
    this.request.url = this.normalizeUrl(parsed.pathname);
    this.request.method = req.method.toLowerCase();
    this.request.headers = req.headers;
    req.query = parsed.query;
    // console.log(data);

    this.handle_request(req, res);
  }

  handle_request(request, response) {
    const route_for_request =
      this.routes.find(route => {
        const { method, url } = this.request;
        return route.method === method && route.url === url;
      }) || this.defaultRoute;
    route_for_request.callback(request, response);
  }

  /**
   *
   * @param {string} method - request method
   * @param {string} path
   * @param {Function} callback
   */
  route(method, url, callback) {
    const newRoute = {
      method: method.toLowerCase(),
      url: this.normalizeUrl(url),
      callback
    };

    this.routes.push(newRoute);
  }

  normalizeUrl(url) {
    return url.replace(/^(\s|\/)*|(\s|\/)*$/g, '');
  }
}

module.exports = Router;
