"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/lib/zod";
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
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" } as LoginFormValues,
    mode: "onTouched",
  });

  function onSubmit(values: LoginFormValues) {
    alert(JSON.stringify(values, null, 2));

    router.replace("/user");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border rounded-md p-8 space-y-4 w-full max-w-sm"
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
          disabled={!form.formState.isValid}
        >
          Login
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
