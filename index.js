import fs from 'fs'
import solc from 'solc'
import json from 'jsonfile'

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
    return new Promise((res, rej) => {
      fs.stat(`${process.cwd()}/${this.file}.compiled.json`, (err, stat) => {
        if (err) res(false)
        console.log('### compiled exists', stat)
        res(true)
      })
    })
  }

  async compileContract() {
    try {
      const data = await this.getContractData()
      const compiled = await this.solcCompile(data)
      await this.writeCompiled(compiled)
    } catch (err) {
      console.log('### Error compiling contract', err)
    }

  }

  async getContractData() {
    return new Promise((res, rej) => {
      fs.readFile(`${this.cwd}/${this.file}.sol`, (err, data) => {
        if(err) rej(err)
        console.log('data(in callback)', data.toString('utf8'))
        res(data.toString('utf8'))
      })
    })
  }

  async solcCompile(data) {
    return new Promise((res, rej) => {
      const compiledData = solc.compile(data)
      res(compiledData)
    })
  }

  async writeCompiled(compiled) {
    return new Promise((res, rej) => {
      json.writeFile(`${this.cwd}/${this.file}.compiled.json`, compiled, (err) => {
        if (err) rej(err)
        res(true)
      })
    })
  }
}
