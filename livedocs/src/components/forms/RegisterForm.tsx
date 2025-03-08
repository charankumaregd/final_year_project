"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from "@/lib/zod";
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

export default function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" } as RegisterFormValues,
    mode: "onTouched",
  });

  function onSubmit(values: RegisterFormValues) {
    alert(JSON.stringify(values, null, 2));

    router.replace("/register/verify-email");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border rounded-md p-8 space-y-4 w-full max-w-sm"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <h2 className="text-lg font-medium">Create your account</h2>
          <p className="text-xs text-muted-foreground">
            Welcome! Please fill in the details to get started.
          </p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your Name"
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

        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={!form.formState.isValid}
        >
          Register
        </Button>

        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs text-muted-foreground">
            <span>Already have an account? </span>
            <Link href="/login" className="underline underline-offset-2">
              Login
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
