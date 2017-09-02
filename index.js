import fs from 'fs'

export default class Eths6 {
  constructor(params) {
    this.listeners = []
    this.crons = []
    this.state = {}
  }

  async setup(params) {
    if (!params.file) new Error('must specify ./path/to/Contract.sol')
    this.file = params.file
    await compile()
  }

  /*
    COMPILE LIBRARY
  */
  async compile() {
    const compiled = await checkCompiled()
  }

  async checkcompiled() {
  
  }
}
