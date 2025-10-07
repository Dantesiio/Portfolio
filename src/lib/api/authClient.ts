import { AuthResponse, AuthUser } from "@/types/auth";

interface AuthError {
  message: string;
  errors?: Array<{ path: (string | number)[]; message: string }>;
}

const handleResponse = async <T>(response: Response) => {
  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as AuthError | null;
    const errorMessage = errorBody?.message ?? "Algo salió mal";
    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<AuthResponse>(response);
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<AuthResponse>(response);
};

export const fetchProfile = async (token: string): Promise<AuthUser> => {
  const response = await fetch("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { user } = await handleResponse<{ user: AuthUser }>(response);
  return user;
};
