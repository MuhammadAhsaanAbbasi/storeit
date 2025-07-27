import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleError = (error: unknown, message: string) => {
  if (error instanceof Error) {
    return { error: error.message, message: message };
  }
  return { error: error }
};

export const parseStringify = (value: unknown) =>
  JSON.parse(JSON.stringify(value));