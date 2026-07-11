import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * `catch (err: unknown)` bloklarından okunabilir bir mesaj çıkarır.
 * Error, string ve `{ message }` benzeri nesneleri güvenle ele alır.
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: unknown }).message ?? "");
  }
  return "Bilinmeyen bir hata oluştu.";
}
