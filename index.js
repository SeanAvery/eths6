import fs from 'fs'

export default class Eths6 {
  constructor(params) {
    this.listeners = []
    this.crons = []
    this.state = {}
    this.setup(params)
  }

  async setup(params) {
    if (!params.file) throw new Error('must specify ./path/to/Contract.sol')
    this.file = params.file
    await this.compile()
  }

  /*
    COMPILE LIBRARY
  */
  async compile() {
    console.log(1)
    const compiled = await this.checkCompiled()
    console.log(2)
    if(!compiled) await this.compileContract()
  }

  async checkcompiled() {
    fs.stat(`${process.cwd()}/${this.file}.compiled.json`, (err, stat) => {
      if (err) return false
      console.log('stat', stat)
      return true
    })
  }

  async compileContract() {
    console.log('compiling contract!!')
  }
}
