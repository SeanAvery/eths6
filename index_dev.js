import fs from 'fs'
import solc from 'solc'
import Eth from 'ethjs'
import levelup from 'levelup'
import sublevel from 'level-sublevel'
import delay from 'await-delay'

export default class Eths6 {
  constructor(params) {
    if (!params.file) throw new Error('### no file name given')
    if (!params.cwd) throw new Error('### add cwd (directory of reference file)')
    if (!params.deploy) {
      if (!params.address) throw new Error('### must supply address if not deploying contract')
      this.address = params.address
    }
    if (params.params) this.params = params.params
    if (!params.provider) this.provider = 'http://localhost:8545'
    if (params.db) this.db = sublevel(params.db)
    else this.db = sublevel(levelup(`./${this.file}`))
    this.file = params.file
    this.cwd = params.cwd
    this.state = {}  // memory tree that is saved to disk
    if (params.setup) this.setup()
  }

  async setup() {
    try {
      this.eth = new Eth(new Eth.HttpProvider(this.provider))
      await this.compile()
      await this.deploy()
    } catch (err) {
      console.log('### ERROR in setup', err)
    }
  }

  /*
    COMPILE LIBRARY
  */

  async compile() {
    try {
      const compiled = await this.checkCompiled()
      if (!compiled) {
        console.log('### compiled does not exist')
        const data = await this.getContractData()
        const cmpld = await solc.compile(data, 1)
        await this.writeCompiled(cmpld)
      }
    } catch (err) {
      console.log('### ERROR compiling contract', err)
    }
  }

  checkCompiled() {
    return new Promise((res, rej) => {
      fs.stat(`${this.cwd}/${this.file}.compiled.json`, (err, stat) => {
        if (err) res(false)
        res(true)
      })
    })
  }

  getContractData() {
    return new Promise((res, rej) => {
      fs.readFile(`${this.cwd}/${this.file}.sol`, (err, data) => {
        if (err) rej(err)
        res(data.toString('utf8'))
      })
    })
  }

  writeCompiled(compiled) {
    return new Promise((res, rej) => {
      fs.writeFile(`${this.cwd}/${this.file}.compiled.json`, JSON.stringify(compiled), (err) => {
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
      const compiled = await this.checkCompiled()
        if (!compiled) await this.compile()
      const data = await this.getCompiled()
      this.bytecode = data.contracts[':' + this.file].bytecode
      this.abi = JSON.parse(data.contracts[':' + this.file].interface)
      this.contract = this.eth.contract(this.abi, this.bytecode)
      const gasPrice = await this.eth.gasPrice()
      const estimate = await this.eth.estimateGas({data: this.bytecode})
      const coinbase = await this.getCoinbase()
      if (this.deploy) this.address = await this.contract.new(...this.params, { from: coinbase, gasPrice: gasPrice, gas: estimate*2 })
      this.contract = this.eth.contract(this.abi).at(this.address)
      return true
    } catch (err) {
      console.log('### ERROR in deploy', err)
    }
  }

  getCompiled() {
    return new Promise((res, rej) => {
      fs.readFile(`${this.cwd}/${this.file}.compiled.json`, (err, data) => {
        if (err) rej(err)
        res(JSON.parse(data.toString('utf8')))
      })
    })
  }

  /*
    STATE CRON
  */

  async cron() {
    try {
      await delay(5000)
      await this.getState()
      await this.cron()
    } catch (err) {
      console.log('### ERROR in cron', err)
    }
  }

  async getState() {
    try {
      const stateGetters = this.abi.filter(comp => {
        if (comp.stateMutability === 'view') return true
      })
      stateGetters.map(fn => {
        console.log('fn', fn)
      })
    } catch (err) {
      console.log('### ERROR in getState', err)
    }
  }

  /*
    EVENT FILTERING
  */

  async setupFilters() {
    try {
      this.abi.map(itm => console.log('item', item))
    } catch (err) {
    }
  }

  /*
    UTILS
  */
  async getCoinbase() {
    try {
      const accounts = await this.eth.accounts()
      return accounts[0]
    } catch (err) {
      console.log('### ERROR in getCoinbase', err)
    }
  }
}
