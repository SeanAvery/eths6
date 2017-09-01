import Eths6 from '../index'

const params = {
  file: './Token.sol',
  deploy: true,
  daemon: 10000,

}

class TokenServer extends Eths6 {
  constructor(params) {
    super()
    console.log('TokenServer constructor', params)
    console.log('Eths6', Eths6)
  }
}

const Token = new TokenServer(params)
