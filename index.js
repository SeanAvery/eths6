import fs from 'fs'
import solc from 'solc'
import json from 'jsonfile'
import Web3 from 'web3'

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
    if (!params.web3Provider) params.web3Provider = 'http://localhost:8545'
    this.web3 = new Web3(params.web3Provider)
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
        // console.log('### compiled exists', stat)
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
      this.bytecode = compiled.contracts[':'+this.file].bytecode
      this.abi = compiled.contracts[':'+this.file].interface
      await this.estimateDeploymentGas()
    } catch (err) {
      console.log('### Error deploying contract', err)
    }
  }

  async getCompiled() {
    return new Promise((res, rej) => {
      fs.readFile(`${this.cwd}/${this.file}.compiled.json`, (err, data) => {
        if(err) rej(err)
        res(JSON.parse(data.toString('utf8')))
      })
    })
  }

  async estimateDeploymentGas() {
    return new Promise((res, rej) => {
      console.log('made it here')
      this.web3.eth.estimateGas({ data: this.bytecode })
      .then(res => {
        console.log('res', res)
        res(res.toNumber())
      }).catch(err => rej(err))
    })
  }

  async deployContract() {
    return new Promise((res, rej) => {

    })
  }
}
