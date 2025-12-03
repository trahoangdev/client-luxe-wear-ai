"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubIcon, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, saveTokens } from "@/services/authUserService";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/authSlice";
import { useForm } from "react-hook-form";

  type LoginForm = { email: string; password: string };

export default function LoginPageV1() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data: LoginForm) => {
    setApiError(null);
    const { email, password } = data;
    try {
      const res = await apiLogin(email.trim(), password);
      if (!res.success || !res.data?.user) throw new Error(res.message || "Login failed");
      saveTokens(res.data?.accessToken, res.data?.refreshToken);
      dispatch(
        setCredentials({
          user: {
            id: res.data.user.id,
            email: res.data.user.email,
            name: res.data.user.name ?? null,
            role: (res.data as any)?.user?.role,
            email_verified: (res.data as any)?.user?.email_verified,
            is_active: (res.data as any)?.user?.is_active,
            last_login: (res.data as any)?.user?.last_login,
          },
          accessToken: res.data.accessToken ?? null,
          refreshToken: res.data.refreshToken ?? null
        })
      );
      router.push("/dashboard");
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors as Array<{ msg: string; param?: string }>;
      if (Array.isArray(apiErrors)) {
        apiErrors.forEach((e) => {
          const field = (e.param as keyof LoginForm) || "email";
          setError(field, { type: "server", message: e.msg });
        });
      } else {
        setApiError(err?.response?.data?.message || err?.message || "Đăng nhập thất bại");
      }
    }
  });

  return (
    <div className="flex min-h-screen pb-8 lg:pb-0">
      <div className="hidden w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background lg:flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10 max-w-md px-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-4">
            <img src="/logoGobal.png" alt="LuxeWear" className="h-12 w-auto" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Welcome to LuxeWear</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Build and deploy AI agents that deliver exceptional customer experiences.
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
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome back</h2>
            <p className="text-sm md:text-base text-muted-foreground">Please sign in to your account</p>
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
              <div className="space-y-2">
                <Label htmlFor="password" className={`text-sm font-medium ${errors.password ? "text-destructive" : ""}`}>
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Vui lòng nhập mật khẩu",
                      minLength: { value: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
                    })}
                    className={`w-full pl-10 pr-10 h-11 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm font-medium text-destructive">{errors.password.message}</p>
                )}
              </div>
              {apiError && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <p className="text-sm font-medium text-destructive">{apiError}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember" className="text-sm text-muted-foreground">
                    Remember me
                  </label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
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
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-3 text-muted-foreground">or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full h-11 hover:bg-muted transition-colors" type="button">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full h-11 hover:bg-muted transition-colors" type="button">
                <GithubIcon className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-medium text-primary hover:underline transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
