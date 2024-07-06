import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center text-white py-20 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-bounce">Welcome to TaskClerk</h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-6">
          Manage your tasks efficiently with real-time updates and intelligent features.
        </p>
        <Link href="/dashboard" className="bg-white text-purple-600 font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Real-Time Collaboration</h3>
              <p className="text-gray-600">Work together with your team in real-time, ensuring everyone is on the same page.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Task Automation</h3>
              <p className="text-gray-600">Automate repetitive tasks to save time and increase productivity.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Customizable Workflows</h3>
              <p className="text-gray-600">Create and manage workflows tailored to your team&apos;s needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Boost Your Productivity?</h2>
          <p className="text-lg mb-6">Join TaskClerk today and take your task management to the next level.</p>
          <Link href="/dashboard" className="bg-white text-green-600 font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};
LandingPage.displayName = 'LandingPage';
export default LandingPage;
