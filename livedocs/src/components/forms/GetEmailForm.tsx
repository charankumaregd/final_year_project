"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetEmailFormValues, getEmailSchema } from "@/lib/zod";
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

export default function GetEmailForm() {
  const router = useRouter();

  const form = useForm<GetEmailFormValues>({
    resolver: zodResolver(getEmailSchema),
    defaultValues: { email: "" } as GetEmailFormValues,
    mode: "onTouched",
  });

  function onSubmit(values: GetEmailFormValues) {
    alert(JSON.stringify(values, null, 2));

    router.replace("/password/verify-email");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border rounded-md p-8 space-y-4 w-full max-w-sm"
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
          continue
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
