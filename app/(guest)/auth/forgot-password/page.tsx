"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ForgotPasswordForm = { email: string };

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit(async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);
    // TODO: Implement forgot password API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  });

  if (submitted) {
    return (
      <div className="flex min-h-screen pb-8 lg:pb-0">
        <div className="hidden w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background lg:flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative z-10 max-w-md px-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-4">
              <img src="/logoGobal.png" alt="LuxeWear" className="h-12 w-auto" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Check your email</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We&apos;ve sent password reset instructions to your email.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="flex w-full items-center justify-center lg:w-1/2 bg-background">
          <div className="w-full max-w-md space-y-8 px-4 py-12">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Check your email</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  We&apos;ve sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password.
                </p>
              </div>
              <div className="pt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="font-medium text-primary hover:underline"
                  >
                    try again
                  </button>
                  .
                </p>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full h-11">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen pb-8 lg:pb-0">
      <div className="hidden w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background lg:flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10 max-w-md px-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-4">
            <img src="/logoGobal.png" alt="LuxeWear" className="h-12 w-auto" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Reset your password</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="flex w-full items-center justify-center lg:w-1/2 bg-background">
        <div className="w-full max-w-md space-y-8 px-4 py-12">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-block mb-4">
              <img src="/logoGobal.png" alt="LuxeWear" className="h-10 w-auto mx-auto" />
            </Link>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Forgot password?</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-sm font-medium ${errors.email ? "text-destructive" : ""}`}>
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    {...register("email", {
                      required: "Vui lòng nhập email",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email không hợp lệ",
                      },
                    })}
                    className={`w-full pl-10 h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    placeholder="your.email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm font-medium text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold rounded-xl" 
                disabled={isSubmitting}
                style={{
                  background: "linear-gradient(90deg, #FF7A7A 0%, #FF8C5A 25%, #FFB056 50%, #A77BFF 75%, #6C7BFF 100%)",
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send reset link <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link href="/auth/login">
              <Button variant="ghost" className="w-full h-11">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

