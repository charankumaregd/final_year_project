import VerifyEmailForm from "@/components/forms/VerifyEmailForm";

export default function VerifyEmail() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full">
      <VerifyEmailForm type="register" />
    </div>
  );
}
