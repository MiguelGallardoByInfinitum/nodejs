const fs = require("node:fs");

console.log("Leyendo el primer archivo ...");
/*fs.readFile("./archivo.txt", "utf-8", (err, text) => {
    console.log("Primer archivo:", text)
})*/
const text = fs.readFileSync("./archivo.txt", "utf-8");
console.log("Primer archivo:", text);

console.log("--> Hacer cosas mientras lee el archivo ... ");

console.log("Leyendo el segundo archivo ...");
const secondText = fs.readFileSync("./archivo2.txt", "utf-8");
console.log("Segundo texto:", secondText);
