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
    await this.deploy()
  }

  /*
    COMPILE LIBRARY
  */

  async compile() {
    try {
      const compiled = await this.checkCompiled()
      if(!compiled) await this.compileContract()
    } catch (err) {
      console.log('### Error compiling', err)
    }
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
      console.log('compiled before fs', compiled)
      await this.writeCompiled(compiled)
    } catch (err) {
      console.log('### Error compiling contract', err)
    }

  }

  async getContractData() {
    return new Promise((res, rej) => {
      fs.readFile(`${this.cwd}/${this.file}.sol`, (err, data) => {
        if(err) rej(err)
        res(data.toString('utf8'))
      })
    })
  }

  async solcCompile(data) {
    return new Promise((res, rej) => {
      const compiledData = solc.compile(data, 1)
      if (compiledData.errors) rej(compiledData)
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

  /*
    DEPLOY LIBRARY
  */

  async deploy() {
    try {
      const compiled = await this.getCompiled()
      console.log('type', typeof compiled)
      this.bytecode = compiled.contracts[':'+this.file].bytecode
      this.abi = compiled.contracts[':'+this.file].interface
      console.log('this.bytecode', this.bytecode)
      console.log('this.abi', this.abi)
    } catch (err) {
      console.log('### Error deploying contract', err)
    }
  }

  async getCompiled() {
    return new Promise((res, rej) => {
      console.log('file ipath', `${this.cwd}/${this.file}.compiled.json`)
      fs.readFile(`${this.cwd}/${this.file}.compiled.json`, (err, data) => {
        if(err) rej(err)
        res(JSON.parse(data.toString('utf8')))
      })
    })
  }
}
