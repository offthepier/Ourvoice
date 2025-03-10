import * as crypto from 'crypto';

const ENCRYPTION_ALGORITHM = "aes128"; // or any other algorithm supported by OpenSSL
const ENCRYPTION_KEY = "mAHi8_h0ra_r8A_k";
const ENCRYPTION_IV = crypto.randomBytes(16) //key.substr(0,16)

export { ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, ENCRYPTION_IV };
