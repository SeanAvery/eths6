class Eths6 {
  constructor(params) {
    console.log('hit constructor', params.file)
  }

  testFunction(x) {
    return x*x;
  }
}

module.exports = Eths6
