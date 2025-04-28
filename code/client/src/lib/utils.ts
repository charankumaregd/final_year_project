import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const colors = [
  "#F87171", // red-400
  "#FBBF24", // yellow-400
  "#34D399", // green-400
  "#60A5FA", // blue-400
  "#A78BFA", // purple-400
  "#F472B6", // pink-400
  "#FCD34D", // yellow-300
  "#4ADE80", // green-400
  "#38BDF8", // sky-400
  "#C084FC", // violet-400
];

export function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
