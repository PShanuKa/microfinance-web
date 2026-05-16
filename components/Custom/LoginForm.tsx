"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useLoginMutation } from "@/services/authApi";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const loginMutation = useLoginMutation({
    onSuccess: (data: any) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.location.href = "/";
    },
    onError: (error: any) => {
      const response = error.response?.data;
      
      // Set the general error message (e.g., "Validation error")
      if (response?.error) {
        setServerError(response.error);
      }

      if (response?.fields) {
        // Map backend validation errors to field-level errors
        Object.keys(response.fields).forEach((field: any) => {
          setError(field, {
            type: "manual",
            message: response.fields[field],
          });
        });
      } else if (!response?.error) {
        setServerError("Login failed. Please check your credentials.");
      }
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setServerError(null);
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-none bg-white/80 backdrop-blur-md">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-500 text-base">
          Enter your email to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6 px-8 py-6">
          {serverError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium p-3 rounded-lg text-center animate-in fade-in slide-in-from-top-1">
              {serverError}
            </div>
          )}
          
          <div className="grid gap-2.5">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`pl-10 h-11 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 ${errors.email ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <a
                href="#"
                className="text-xs font-medium text-primary hover:underline transition-all"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`pl-10 pr-10 h-11 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 ${errors.password ? 'border-destructive focus:border-destructive focus:ring-destructive' : ''}`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-8 pb-8 flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="#" className="font-semibold text-primary hover:underline">
              Contact Admin
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
