"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyEmailFormValues, verifyEmailSchema } from "@/lib/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

interface VerifyEmailFormProps {
  redirectTo: string;
}

export default function VerifyEmailForm({ redirectTo }: VerifyEmailFormProps) {
  const router = useRouter();

  const email = "sample@email.com";

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: email,
      verificationCode: "",
    } as VerifyEmailFormValues,
    mode: "onTouched",
  });

  function onSubmit(values: VerifyEmailFormValues) {
    alert(JSON.stringify(values, null, 2));

    router.replace(redirectTo);
  }

  function resendCode() {
    alert("Code resent!");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border rounded-md p-8 space-y-4 w-full max-w-sm"
      >
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <h2 className="text-lg font-medium">Verify your email</h2>
          <p className="text-xs text-muted-foreground">
            Enter the verification code sent to your email
          </p>
          <p className="text-sm text-muted-foreground flex items-center justify-center space-x-2">
            <span>{email}</span>
          </p>
        </div>

        <div className="flex items-center justify-center">
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                    <InputOTPGroup>
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={!form.formState.isValid}
        >
          Continue
        </Button>

        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            <span>Didn&apos;t recieve a code? </span>
            <span
              onClick={resendCode}
              className=" cursor-pointer underline underline-offset-2"
            >
              Resend
            </span>
          </p>
        </div>
      </form>
    </Form>
  );
}
