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
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";

interface VerifyEmailFormProps {
  type: string;
}

export default function VerifyEmailForm({ type }: VerifyEmailFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: email,
      verificationCode: "",
    } as VerifyEmailFormValues,
    mode: "onTouched",
  });

  useEffect(() => {
    const storedEmail = sessionStorage.getItem(
      type === "register" ? "registerEmail" : "verificationEmail"
    );
    if (storedEmail) {
      setEmail(storedEmail);
      form.reset({ email: storedEmail });
    } else {
      setTimeout(() => {
        if (type === "register") {
          toast.error("No email found. Please register again.");
          router.replace("/register");
        } else {
          toast.error("No email found. Please provide again.");
          router.replace("/password/forgot");
        }
      }, 100);
    }
  }, [form, router, type]);

  async function onSubmit(formData: VerifyEmailFormValues) {
    setLoading(true);
    try {
      const response = await fetch(`/api/${type}/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const { error } = await response.json();
        toast.error(`Error: ${error}`);
        return;
      }

      const { message } = await response.json();
      toast.success(message);

      sessionStorage.removeItem(
        type === "register" ? "registerEmail" : "verificationEmail"
      );

      if (type === "password") {
        sessionStorage.setItem("resetPasswordEmail", formData.email);
      }

      router.replace(type === "register" ? "/user" : "/password/reset");
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    try {
      const response = await fetch(`/api/${type}/verify-email/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        toast.error(`Error: ${error}`);
        return;
      }

      const { message } = await response.json();
      toast.success(message);
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border rounded-md p-8 space-y-4 w-full max-w-sm shadow-lg"
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
                    {[...Array(6)].map((_, index) => (
                      <InputOTPGroup key={index}>
                        <InputOTPSlot index={index} />
                      </InputOTPGroup>
                    ))}
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
          disabled={!form.formState.isValid || loading}
        >
          {loading ? <LoaderCircle className="animate-spin" /> : "Continue"}
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
