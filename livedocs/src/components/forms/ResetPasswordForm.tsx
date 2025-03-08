"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordFormValues, resetPasswordSchema } from "@/lib/zod";
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
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const router = useRouter();

  const email = "sample@email.com";
  const verificationCode = "121212";

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      verificationCode: verificationCode,
      newPassword: "",
    } as ResetPasswordFormValues,
    mode: "onTouched",
  });

  function onSubmit(values: ResetPasswordFormValues) {
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
          <h2 className="text-lg font-medium">Reset Password</h2>
          <p className="text-xs text-muted-foreground">
            Enter your new password to reset
          </p>
        </div>

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Your New Password"
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
          Reset Password
        </Button>
      </form>
    </Form>
  );
}
