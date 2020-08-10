module.exports = (str, color) => {
  console.log('-'.repeat(str.length + 1)[color])
  console.log(`${str}`[color])
  console.log('-'.repeat(str.length + 1)[color])
}
