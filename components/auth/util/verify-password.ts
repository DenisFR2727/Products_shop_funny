"use server";
import crypto from "node:crypto";

export async function verifyPassword(
  enteredPassword: string,
  storedPassword: string, // format: hash:salt
): Promise<boolean> {
  const [storedHash, salt] = storedPassword.split(":");

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(enteredPassword, salt, 64, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });

  return storedHash === derivedKey.toString("hex");
}
