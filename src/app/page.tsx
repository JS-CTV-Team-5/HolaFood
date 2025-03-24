import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-8">
      <h1 className="text-4xl font-bold">Food Review App</h1>
      <div className="flex space-x-8">
        <RegisterForm />
        <LoginForm />
      </div>
    </main>
  );
}
