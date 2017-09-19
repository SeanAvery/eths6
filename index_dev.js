import fs from 'fs'
import solc from 'solc'

export default class Eths6 {
  constructor(params) {
    if (!params.file) throw new Error('### no file name given')
    if (!params.cwd) throw new Error('### add cwd (directory of reference file)')
    if (!params.deploy) {
      if (!params.address) throw new Error('### must supply address if not deploying contract')
      this.address = params.address
    }
    this.file = params.file
    this.cwd = params.cwd
    this.state = {}  // memory tree that is saved to disk
    if (params.setup) this.setup()
  }

  async setup() {
    try {
      await this.compile()
    } catch (err) {
      console.log('### ERROR in setup', err)
    }
  }

  async compile() {
    try {
      const compiled = await this.checkCompiled()
      if (!compiled) {
        console.log('### compiled does not exist')
        const data = await this.getContractData()
        const compiled = await solc.compile(data, 1)
        console.log('compiled', compiled)
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
}
