import Eths6 from '../index'

const params = {
  file: 'Token',
  cwd: __dirname,
  deploy: true,
  daemon: 10000,
  web3Provider: 'http://localhost:8545',
  contractParams: [
    "Mob",
    "MOB",
    0,
    1000
  ]
}

class TokenServer extends Eths6 {
  constructor(params) {
    super(params)
  }
}

const Token = new TokenServer(params)
