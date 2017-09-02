import fs from 'fs'
import solc from 'solc'

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
      await this.solcCompile()
    } catch (err) {
      console.log('### Error compiling contract', err)
    }

  }

  async getContractData() {
    console.log('path', `${process.cwd()}/${this.file}.sol`)
    fs.readFile(`${process.cwd()}/${this.file}.sol`, (err, data) => {
      if(err) throw new Error('### Could not get contract data')
      console.log('data', data)
      return data.toString()
    })
  }

  async solcCompile(data) {
    const compiledData = solc.compile(data)
    console.log('compiledData', compiledData)
  }
}
