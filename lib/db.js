const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const BASE_DIR = path.resolve('.data', 'db.json');

class Database {
  constructor() {
    this.dir = BASE_DIR;
  }
  async write(json) {
    await writeFile(this.dir, JSON.stringify(json));
  }

  async read() {
    const content = await readFile(this.dir, 'utf8');
    return content ? JSON.parse(content) : {};
  }

  async create(user) {
    try {
      const state = await this.read();
      state[user.id] = user;
      await this.write(state);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const state = await this.read();
      if (state[id]) {
        delete state[id];
        this.write(state);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async get(id) {
    try {
      const state = await this.read();
      return state[id] ? state[id] : null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id, obj) {
    try {
      const state = await this.read();
      if (state[id]) {
        for (let i in obj) {
          if (obj[i]) {
            state[id][i] = obj[i];
          }
        }
        this.write(state);
      }
      return state[id];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

// const db = new Database();

module.exports = new Database();
