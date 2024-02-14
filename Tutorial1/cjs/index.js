globalThis.console.log("No window u know")
console.log("window <-- (navegador) globalThis (nodejs) --> global")
console.log(globalThis)

// CommonJS require import
const { sum } = require("./sum")

console.log(sum(1, 2))