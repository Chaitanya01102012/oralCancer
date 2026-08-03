"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean(),
});

const registerSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitting, setSubmitting] = useState(false);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: "", email: "", password: "" },
  });

  async function onLogin(values: LoginValues) {
    setSubmitting(true);
    try {
      await login(values.email, values.password, values.remember);
      toast.success("Welcome back");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Login failed";
      toast.error(typeof message === "string" ? message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function onRegister(values: RegisterValues) {
    setSubmitting(true);
    try {
      await register(values.email, values.password, values.full_name);
      toast.success("Account created");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Registration failed";
      toast.error(typeof message === "string" ? message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#12141f]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(109,191,143,0.08)_0%,_transparent_60%)]" />
      <Navbar />
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <div className="rounded-3xl border border-[#252840] bg-[#1a1d2e] p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-white">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-[#a0a8b8]">
            Access your OralCare AI diagnostic workspace.
          </p>

          {mode === "login" ? (
            <form className="mt-8 space-y-4" onSubmit={loginForm.handleSubmit(onLogin)}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...loginForm.register("email")} />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-[#e05555]">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...loginForm.register("password")} />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-[#e05555]">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={loginForm.watch("remember")}
                  onCheckedChange={(v) => loginForm.setValue("remember", v === true)}
                />
                <Label htmlFor="remember" className="font-normal">
                  Remember Me
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]"
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Login"}
              </Button>
            </form>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={registerForm.handleSubmit(onRegister)}>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" {...registerForm.register("full_name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg_email">Email</Label>
                <Input id="reg_email" type="email" {...registerForm.register("email")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg_password">Password</Label>
                <Input id="reg_password" type="password" {...registerForm.register("password")} />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Account"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[#a0a8b8]">
            {mode === "login" ? (
              <>
                Need an account?{" "}
                <button
                  type="button"
                  className="font-medium text-[#6dbf8f]"
                  onClick={() => setMode("register")}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}
                <button
                  type="button"
                  className="font-medium text-[#6dbf8f]"
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
              </>
            )}
          </p>
          <p className="mt-3 text-center text-xs text-[#7a8299]">
            <Link href="/" className="hover:text-[#6dbf8f] transition-colors">Back to homepage</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
