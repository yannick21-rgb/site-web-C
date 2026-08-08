import LoginForm from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="hero-bg"></div>
      <div className="relative z-[2]">
        <LoginForm />
      </div>
    </div>
  );
}