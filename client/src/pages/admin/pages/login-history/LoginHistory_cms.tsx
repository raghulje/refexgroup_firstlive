import { useState, useEffect } from 'react';
import { loginHistoryService } from '../../../../services/apiService';
import { DataTable } from '../../shared/DataTable';

interface LoginHistory {
  id: number;
  userId: number;
  ipAddress: string | null;
  userAgent: string | null;
  loginStatus: 'success' | 'failed' | 'locked';
  failureReason: string | null;
  logoutAt: string | null;
  sessionDuration: number | null;
  createdAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export default function LoginHistory_cms() {
  const [history, setHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    loginStatus: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchHistory();
  }, [page, filters]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 50 };
      if (filters.loginStatus) params.loginStatus = filters.loginStatus;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await loginHistoryService.getAll(params);
      setHistory(response.history || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error('Error fetching login history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      success: { class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Success' },
      failed: { class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Failed' },
      locked: { class: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: 'Locked' },
    };
    const badge = badges[status] || badges.success;
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading login history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Login History</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track all user login and logout activities
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.loginStatus}
              onChange={(e) => setFilters({ ...filters, loginStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="locked">Locked</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ loginStatus: '', startDate: '', endDate: '' })}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <DataTable
          data={history}
          columns={[
            {
              key: 'user',
              header: 'USER',
              render: (value, item: LoginHistory) => (
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {item.user?.username || 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.user?.email}
                  </div>
                </div>
              ),
            },
            {
              key: 'loginStatus',
              header: 'STATUS',
              render: (value) => getStatusBadge(value as string),
            },
            {
              key: 'ipAddress',
              header: 'IP ADDRESS',
              render: (value) => (
                <span className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                  {value || 'N/A'}
                </span>
              ),
            },
            {
              key: 'createdAt',
              header: 'LOGIN TIME',
              render: (value) => (
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {formatDate(value as string)}
                </span>
              ),
            },
            {
              key: 'logoutAt',
              header: 'LOGOUT TIME',
              render: (value) => (
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {value ? formatDate(value as string) : 'Active'}
                </span>
              ),
            },
            {
              key: 'sessionDuration',
              header: 'DURATION',
              render: (value, item: LoginHistory) => (
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {formatDuration(item.sessionDuration)}
                </span>
              ),
            },
            {
              key: 'failureReason',
              header: 'NOTES',
              render: (value, item: LoginHistory) => (
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {item.failureReason || '-'}
                </span>
              ),
            },
          ]}
          loading={loading}
          emptyMessage="No login history found"
        />

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

