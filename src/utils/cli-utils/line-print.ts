const linePrint = (str: string, color: any) => {
  console.log("-".repeat(str.length + 1)[color])
  console.log(`${str}`[color])
  console.log("-".repeat(str.length + 1)[color])
}

export default linePrint
