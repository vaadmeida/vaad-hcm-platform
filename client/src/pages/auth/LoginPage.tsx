import AuthBranding from "@/components/auth/AuthBranding";
import AuthCard from "@/components/auth/AuthCard";

const LoginPage = () => {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <AuthBranding />
      <AuthCard />
    </main>
  );
};

export default LoginPage;