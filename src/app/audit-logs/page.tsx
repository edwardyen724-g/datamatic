import { useEffect, useState } from 'react';
import { fetchAuditLogs } from '@/lib/api';
import { AuditLog } from '@/types';

const AuditLogsPage = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAuditLogs = async () => {
            try {
                const fetchedLogs = await fetchAuditLogs();
                setLogs(fetchedLogs);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        loadAuditLogs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading audit logs: {error}</div>;
    }

    return (
        <div>
            <h1>Audit Logs</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td>{new Date(log.date).toLocaleString()}</td>
                            <td>{log.user}</td>
                            <td>{log.action}</td>
                            <td>{log.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AuditLogsPage;