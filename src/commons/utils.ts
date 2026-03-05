import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// tailwind merge resolves conflicts between Tailwind classes
// clsx combines class names -> ignores false-like values
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// check if an email is valid
export function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
