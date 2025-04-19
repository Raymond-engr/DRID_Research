"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";

// Define validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .refine((val) => val.includes("."), {
      message: "Email must include a domain extension (e.g., .com)",
    }),
  password: z.string().min(1, "Password is required"),
});

export default function ResearcherLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { researcherLogin } = useContext(AuthContext);
  const router = useRouter();

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      setValidationErrors({});
      return true;
    } catch (error) {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setValidationErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await researcherLogin(email, password);
      router.push("/researcher");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
      router.push("/researcher");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Researcher Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your researcher dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="researcher@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={validationErrors.email ? "border-red-500" : ""}
                required
              />
              {validationErrors.email && (
                <p className="text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={validationErrors.password ? "border-red-500" : ""}
                required
              />
              {validationErrors.password && (
                <p className="text-sm text-red-500">
                  {validationErrors.password}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 justify-center">
          <p className="text-sm text-muted-foreground">
            Research Portal for Lecturers and Researchers
          </p>
          <p className="text-xs text-center">
            If you received an invitation but haven&apos;t registered yet,
            please use the link in your email.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
