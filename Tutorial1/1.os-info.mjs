import {
  platform,
  release,
  arch,
  cpus,
  freemem,
  totalmem,
  uptime,
} from "node:os";
// import os from "node:os"

console.log("Informacion del sistema operativo:");
console.log("-------------------------");

console.log("Nombre del sistema operativo " + platform());
console.log("Version del sistema operativo " + release());
console.log("Arquitectura " + arch());
console.log("CPUs " + cpus()); // <-- Vamos a poder escalar procesos en node
console.log("Memoria libre " + freemem() / 1024 / 1024);
console.log("Memoria total " + totalmem() / 1024 / 1024);
console.log(uptime / 60 / 60 / 24);
