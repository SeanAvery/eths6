import Eths6 from '../index'

const params = {
  file: './Token.sol',
  deploy: true,
  daemon: 10000,

}

class TokenServer extends Eths6 {
  constructor(params) {
    super(params)
    this.parseParams(params)
  }

  async parseParams(params) {
    console.log('params', params)
    console.log('Eths6', this.testFunction(10))
  }
}

const Token = new TokenServer(params)
