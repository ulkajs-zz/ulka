module.exports = () => ({
  beforeMdParse: () => {
    console.log("before md parse")
  },

  afterMdParse: () => {
    console.log("After md parse")
  },

  beforeUlkaParse: () => {
    console.log("Before ulka parse")
  },

  afterUlkaParse: () => {
    console.log("After ulka parse")
  }
})
