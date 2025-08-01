"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { LoginFormValues, loginSchema } from "@/lib/zod";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirectUrl");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" } as LoginFormValues,
    mode: "onTouched",
  });

  async function onSubmit(formData: LoginFormValues) {
    setIsLoading(true);
    try {
      const response = await api("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { message } = await response.json();
      toast.success(message);

      const decodedRedirectUrl = redirectUrl
        ? decodeURIComponent(redirectUrl)
        : "/user";

      router.replace(decodedRedirectUrl);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border rounded-md p-8 space-y-4 w-full max-w-sm shadow-lg"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <h2 className="text-lg font-medium">Login to LiveDocs</h2>
          <p className="text-xs text-muted-foreground">
            Welcome back! Please login to continue
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="text-sm"
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Your Password"
                  className="text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end">
          <Link
            href="/password/forgot"
            className="text-xs text-muted-foreground hover:underline hover:underline-offset-2"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={!form.formState.isValid || isLoading}
        >
          {isLoading ? <LoaderIcon className="animate-spin" /> : "Login"}
        </Button>

        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs text-muted-foreground">
            <span>Don&apos;t have an account? </span>
            <Link href="/register" className="underline underline-offset-2">
              Register
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
