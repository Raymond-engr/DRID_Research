import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const getImageUrl = (profilePicture) => {
  if (!profilePicture) return null;

  // If it's already a URL that starts with http, return as is
  if (profilePicture.startsWith("http")) {
    return profilePicture;
  }

  // If it's a file path, convert it to a URL
  // Extract just the filename from the path
  const fileName = profilePicture.split("\\").pop().split("/").pop();

  // In development
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:3000/uploads/profiles/${fileName}`;
  }

  return `https://your-api-domain.com/uploads/profiles/${fileName}`;
};
