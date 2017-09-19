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
    this.state = { }  // memory tree that is saved to disk
  }

  async compile() {

  }

  async deploy() {

  }


}
