import React from 'react';
import Link from 'next/link';

const Page: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-blue-600">
        Transform Your Data Management in Healthcare and Beyond
      </h1>
      <p className="mt-4 text-lg text-center text-gray-700">
        Streamlined data editing for specialized industries.
      </p>
      
      <div className="mt-8 p-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800">Key Features</h2>
        <ul className="mt-4 list-disc list-inside text-gray-600">
          <li>Multi-select editing capability to update multiple entries at once.</li>
          <li>Linked record management to easily navigate and edit associated data.</li>
          <li>Real-time collaboration for team members to work on data simultaneously.</li>
          <li>Customizable data display options to fit specific industry needs.</li>
          <li>Audit logs to track changes and maintain compliance records.</li>
        </ul>
      </div>

      <Link href="/signup">
        <a className="mt-6 inline-block px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300">
          Get Started
        </a>
      </Link>
    </main>
  );
};

export default Page;