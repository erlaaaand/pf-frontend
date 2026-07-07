"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { register } from "../../services/auth.service";
import { isAxiosError } from "axios";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      institution: formData.get("institution") as string,
      password: formData.get("password") as string,
    };

    try {
      await register(payload);
      router.push(`/verify?email=${encodeURIComponent(payload.email)}`);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registrasi gagal. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your details below to register
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-center">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <Input id="fullName" name="fullName" placeholder="John Doe" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
          <Input id="phoneNumber" name="phoneNumber" placeholder="08123456789" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="institution">Institution</FieldLabel>
          <Input id="institution" name="institution" placeholder="Universitas / Sekolah" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-0 h-full w-10 rounded-l-none hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </Field>

        <Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}