const os = require("os");

const totalMemoryInBytes = os.totalmem();
const freeMemoryInBytes = os.freemem();

const totalMemoryInMB = (totalMemoryInBytes / (1024 * 1024)).toFixed(2);
const freeMemoryInMB = (freeMemoryInBytes / (1024 * 1024)).toFixed(2);

console.log("Total memory (in MB):", totalMemoryInMB);
console.log("Free memory (in MB):", freeMemoryInMB);
console.log("Push sth2:");
