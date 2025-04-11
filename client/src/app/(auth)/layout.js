import { AuthProvider } from "@/lib/auth";

export default function AuthLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
