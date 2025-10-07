const DEFAULT_JWT_SECRET = "insecure-dev-secret";

export const getJwtSecret = () => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set to a secure value in production");
  }

  return DEFAULT_JWT_SECRET;
};
