import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          Coding Problems
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/problem1" className="transform hover:scale-105 transition-transform">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Problem 1</h2>
              <p className="text-gray-600 dark:text-gray-300">Sum to N Implementation</p>
            </div>
          </Link>
          
          <Link href="/problem2" className="transform hover:scale-105 transition-transform">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">Problem 2</h2>
              <p className="text-gray-600 dark:text-gray-300">Fancy Form</p>
            </div>
          </Link>
          
          <Link href="/problem3" className="transform hover:scale-105 transition-transform">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Problem 3</h2>
              <p className="text-gray-600 dark:text-gray-300">Messy React</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
