import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) =>
  bcrypt.hash(password, SALT_ROUNDS);

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash);
