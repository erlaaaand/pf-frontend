"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { verifyEmailAction } from "../../services/auth.action";

export function VerifyForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;

    try {
      await verifyEmailAction({ email, otp });
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal memverifikasi OTP. Silakan coba lagi.");
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
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="text-sm text-balance text-muted-foreground">
            We have sent a 6-digit OTP to your email
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-center">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={!!searchParams.get("email")}
            className={searchParams.get("email") ? "bg-muted" : ""}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="otp">OTP Code</FieldLabel>
          <Input
            id="otp"
            name="otp"
            type="text"
            maxLength={6}
            placeholder="123456"
            required
            className="text-center tracking-widest"
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify & Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}