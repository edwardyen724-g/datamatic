import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const DashboardPage: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        <h1>Please sign in to access your dashboard</h1>
        <Link href="/api/auth/signin">Sign In</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Transform Your Data Management in Healthcare and Beyond</h1>
      <p>Welcome, {session.user?.name}!</p>
      <p>
        DataMatic provides streamlined data editing features tailored for
        healthcare data analysts:
      </p>
      <ul>
        <li>Multi-select editing capability to update multiple entries at once.</li>
        <li>Linked record management to easily navigate and edit associated data.</li>
        <li>Real-time collaboration for team members to work on data simultaneously.</li>
        <li>Customizable data display options to fit specific industry needs.</li>
        <li>Audit logs to track changes and maintain compliance records.</li>
      </ul>
      <Link href="/data-entries">Go to Data Entries</Link>
    </div>
  );
};

export default DashboardPage;