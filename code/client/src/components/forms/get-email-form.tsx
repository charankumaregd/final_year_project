"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { GetEmailFormValues, getEmailSchema } from "@/lib/zod";

export default function GetEmailForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<GetEmailFormValues>({
    resolver: zodResolver(getEmailSchema),
    defaultValues: { email: "" } as GetEmailFormValues,
    mode: "onTouched",
  });

  async function onSubmit(formData: GetEmailFormValues) {
    setIsLoading(true);
    try {
      const response = await api("/api/password/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { message } = await response.json();
      toast.success(message);

      sessionStorage.setItem("verificationEmail", formData.email);

      router.replace("/password/verify-email");
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
          <h2 className="text-lg font-medium">Forgot Password?</h2>
          <p className="text-xs text-muted-foreground">
            Please enter your email to continue
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

        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={!form.formState.isValid || isLoading}
        >
          {isLoading ? <LoaderIcon className="animate-spin" /> : "Continue"}
        </Button>

        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs text-muted-foreground">
            <span>Go back to </span>
            <Link href="/register" className="underline underline-offset-2">
              Register
            </Link>
            <span> or </span>
            <Link href="/login" className="underline underline-offset-2">
              Login
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
