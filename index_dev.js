import fs from 'fs'

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
      console.log('compiled', compiled)
    } catch (err) {
      console.log('### ERROR compiling contract', err)
    }
  }

  checkCompiled() {
    return new Promise((res, rej) => {
      fs.stat(`${this.cwd}/${this.file}.compiled.json`, (err, stat) => {
        if (err) res(false)
        console.log('### compiled already exists')
        res(true)
      })
    })
   }
}
