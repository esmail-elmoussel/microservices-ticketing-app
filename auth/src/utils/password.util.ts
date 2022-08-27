import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

export class Password {
  static async hash(password: string) {
    const salt = randomBytes(8).toString("hex");

    const buffer = (await scrypt(password, salt, 32)) as Buffer;

    const hashWithoutSalt = buffer.toString("hex");

    const hash = salt + "." + hashWithoutSalt;

    return hash;
  }

  static async compare(password: string, hash: string) {
    const [salt, hashWithoutSalt] = hash.split(".");

    const buffer = (await scrypt(password, salt, 32)) as Buffer;

    return hashWithoutSalt === buffer.toString("hex");
  }
}
