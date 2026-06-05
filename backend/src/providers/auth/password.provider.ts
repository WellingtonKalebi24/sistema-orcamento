import bcrypt from "bcrypt";

const BCRYPT_COST = 12;

export class PasswordProvider {
  hash(password: string) {
    return bcrypt.hash(password, BCRYPT_COST);
  }

  compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
