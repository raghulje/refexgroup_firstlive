import { useState, useEffect } from 'react';
import { activityLogsService } from '../../../../services/apiService';
import { ExportButton } from '../../shared/ExportButton';
import { exportActivityLogs } from '../../shared/ExportUtils';

interface ActivityLog {
  id: number;
  userId: number;
  activityType: string;
  entityType: string | null;
  entityId: number | null;
  title: string;
  description: string | null;
  metadata: any;
  isRead: boolean;
  createdAt: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export default function ActivityLogs_cms() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchActivities();
    fetchUnreadCount();
  }, [page]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityLogsService.getAll({ page, limit: 50 });
      setActivities(response.activities || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await activityLogsService.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await activityLogsService.markAsRead(id);
      setActivities(prev => prev.map(activity => 
        activity.id === id ? { ...activity, isRead: true } : activity
      ));
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await activityLogsService.markAllAsRead();
      setActivities(prev => prev.map(activity => ({ ...activity, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getActivityIcon = (activityType: string) => {
    const icons: Record<string, string> = {
      'content_created': 'ri-add-circle-line',
      'content_updated': 'ri-edit-line',
      'content_deleted': 'ri-delete-bin-line',
      'content_published': 'ri-eye-line',
      'content_unpublished': 'ri-eye-off-line',
      'user_login': 'ri-login-box-line',
      'user_logout': 'ri-logout-box-line',
      'user_created': 'ri-user-add-line',
      'user_updated': 'ri-user-settings-line',
      'media_uploaded': 'ri-upload-cloud-line',
      'media_deleted': 'ri-delete-bin-line',
      'export_generated': 'ri-download-line',
      'settings_changed': 'ri-settings-line',
    };
    return icons[activityType] || 'ri-notification-line';
  };

  const getActivityColor = (activityType: string) => {
    if (activityType.includes('created')) return 'text-green-600 dark:text-green-400';
    if (activityType.includes('updated')) return 'text-blue-600 dark:text-blue-400';
    if (activityType.includes('deleted')) return 'text-red-600 dark:text-red-400';
    if (activityType.includes('published')) return 'text-purple-600 dark:text-purple-400';
    if (activityType.includes('login') || activityType.includes('logout')) return 'text-indigo-600 dark:text-indigo-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Activity Feed</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Recent changes and activities in the CMS
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <i className="ri-check-double-line"></i>
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <i className="ri-inbox-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600 dark:text-gray-400">No activities yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  !activity.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    getActivityColor(activity.activityType)
                  } bg-gray-100 dark:bg-gray-700`}>
                    <i className={`${getActivityIcon(activity.activityType)} text-xl`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {activity.title}
                        </p>
                        {activity.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {activity.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            <i className="ri-user-line mr-1"></i>
                            {activity.user?.username || 'System'}
                          </span>
                          <span>
                            <i className="ri-time-line mr-1"></i>
                            {formatTime(activity.createdAt)}
                          </span>
                        </div>
                      </div>
                      {!activity.isRead && (
                        <button
                          onClick={() => markAsRead(activity.id)}
                          className="ml-4 p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                          title="Mark as read"
                        >
                          <i className="ri-check-line"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

