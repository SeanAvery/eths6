import Eths6 from '../index_dev.js'

const params = {
  file: 'Token',
  cwd: __dirname,
  deploy: true,
  setup: true,
  params: [
    "Mob",
    "MOB",
    0,
    1000
  ],
}

class TokenServer extends Eths6 {
  constructor(params) {
    super(params)
  }
}

new TokenServer(params)
