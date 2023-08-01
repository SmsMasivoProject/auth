import * as bcrypt from 'bcrypt';

async function encryp(textToEncrypt: string): Promise<string>{
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(textToEncrypt, salt);
}

async function decryp( password: string, hash: string): Promise<boolean>{
   return await bcrypt.compare(password, hash);
}

export {encryp, decryp}