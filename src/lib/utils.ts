import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeIndianMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  if (/^[6-9]\d{9}$/.test(digits)) return digits;
  if (/^0[6-9]\d{9}$/.test(digits)) return digits.slice(1);
  if (/^91[6-9]\d{9}$/.test(digits)) return digits.slice(2);
  if (/^091[6-9]\d{9}$/.test(digits)) return digits.slice(3);
  return "";
}

export function isValidIndianMobile(value: string) {
  return normalizeIndianMobile(value).length === 10;
}
