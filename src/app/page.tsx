import connectToDatabase from "@/lib/mongoose";

export default async function Home() {
  await connectToDatabase(); // Kết nối DB khi chạy server-side

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Food Review App</h1>
      <p className="mt-4">Database connected successfully!</p>
    </main>
  );
}
