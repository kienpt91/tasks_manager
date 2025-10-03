import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Task Manager</h1>
        <p className="text-gray-600 mb-8">Manage your tasks efficiently</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
