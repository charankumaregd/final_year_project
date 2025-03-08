import GetEmailForm from "@/components/forms/GetEmailForm";

export default function ResetPassword() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full">
      <GetEmailForm />
    </div>
  );
}
