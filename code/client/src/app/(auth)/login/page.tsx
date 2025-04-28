import { Suspense } from "react";

import LoginForm from "@/components/forms/login-form";
import Loader from "@/components/loader";

export default function Login() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginForm />
    </Suspense>
  );
}
