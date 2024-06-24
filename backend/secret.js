const crypto = require('crypto');
const Secret = crypto.randomBytes(64).toString('hex');
console.log(Secret);
