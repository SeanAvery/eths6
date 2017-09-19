import Eths6 from '../index_dev.js'

const params = {
  file: 'Token',
  cwd: __dirname,
  deploy: true,
  setup: true
}

class TokenServer extends Eths6 {
  constructor(params) {
    super(params)
  }
}

new TokenServer(params)
