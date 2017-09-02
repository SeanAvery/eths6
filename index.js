import fs from 'fs'
import solc from 'solc'

export default class Eths6 {
  constructor(params) {
    this.listeners = []
    this.crons = []
    this.state = {}
    this.cwd = params.cwd
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
    const compiled = await this.checkCompiled()
    if(!compiled) await this.compileContract()
  }

  async checkCompiled() {
    fs.stat(`${process.cwd()}/${this.file}.compiled.json`, (err, stat) => {
      if (err) return false
      console.log('### compiled exists', stat)
      return true
    })
  }

  async compileContract() {
    try {
      const data = await this.getContractData()
      console.log('data', data)
      await this.solcCompile(data)
    } catch (err) {
      console.log('### Error compiling contract', err)
    }

  }

  async getContractData() {
    return new Promise((res, rej) => {
      fs.readFile(`${this.cwd}/${this.file}.sol`, (err, data) => {
        if(err) rej(err)
        console.log('data(in callback)', data)
        res(data)
      })
    })
  }

  async solcCompile(data) {
    console.log('data(solc)', data)
    const compiledData = solc.compile(data)
    console.log('compiledData', compiledData)
  }
}
