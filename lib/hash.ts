import crypto from "node:crypto";

export async function hashUserPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");

  const key = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });

  return `${key.toString("hex")}:${salt}`;
}
