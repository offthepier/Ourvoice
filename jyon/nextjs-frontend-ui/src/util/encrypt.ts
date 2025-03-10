import AES from "crypto-js/aes";
import Crypto from "crypto-js";

const encrypt = (text: string): string => {
  return AES.encrypt(
    JSON.stringify({ text }),
    process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? ""
  ).toString();
};

const decrypt = (text: string): string => {
  let bytes = Crypto.AES.decrypt(
    text.toString(),
    process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? ""
  );
  try {
	return bytes.toString(Crypto.enc.Utf8);
  } catch(error) {
	console.log(error);
	return text;
  }
};

export { encrypt, decrypt };
