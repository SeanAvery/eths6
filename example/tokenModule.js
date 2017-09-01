const Eths6 = require('../index')

const params = {
  file: './Token.sol',
  deploy: true,
  daemon: 10000,

}

class TokenServer extends Eths6 {
  constructor(params) {
    super()
    console.log('TokenServer constructor')
  }
}

const Token = new TokenServer(params)
