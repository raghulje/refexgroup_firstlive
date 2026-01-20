import { useState } from 'react';
import { publishService } from '../../../services/apiService';

interface PublishToggleProps {
  entityType: string;
  entityId: number;
  currentStatus: 'draft' | 'published' | 'scheduled';
  publishedAt?: string | null;
  scheduledPublishAt?: string | null;
  onStatusChange?: () => void;
  showSchedule?: boolean;
}

export const PublishToggle = ({
  entityType,
  entityId,
  currentStatus,
  publishedAt,
  scheduledPublishAt,
  onStatusChange,
  showSchedule = false,
}: PublishToggleProps) => {
  const [loading, setLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  const handlePublish = async () => {
    if (showSchedule && !publishedAt) {
      setShowScheduleModal(true);
      return;
    }

    try {
      setLoading(true);
      await publishService.publish(entityType, entityId);
      if (onStatusChange) onStatusChange();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to publish');
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!window.confirm('Are you sure you want to unpublish this content?')) {
      return;
    }

    try {
      setLoading(true);
      await publishService.unpublish(entityType, entityId);
      if (onStatusChange) onStatusChange();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to unpublish');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedulePublish = async () => {
    if (!scheduleDate) {
      alert('Please select a date and time');
      return;
    }

    try {
      setLoading(true);
      await publishService.publish(entityType, entityId, scheduleDate);
      setShowScheduleModal(false);
      setScheduleDate('');
      if (onStatusChange) onStatusChange();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to schedule publication');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (currentStatus === 'published') {
      return (
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-semibold">
          Published
        </span>
      );
    }
    if (currentStatus === 'scheduled') {
      return (
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-semibold">
          Scheduled
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-semibold">
        Draft
      </span>
    );
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {getStatusBadge()}
        {currentStatus === 'draft' || currentStatus === 'scheduled' ? (
          <button
            onClick={handlePublish}
            disabled={loading}
            className="px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-800 disabled:opacity-50 text-sm flex items-center gap-1"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                Publishing...
              </>
            ) : (
              <>
                <i className="ri-eye-line"></i>
                Publish Now
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleUnpublish}
            disabled={loading}
            className="px-3 py-1 bg-gray-600 dark:bg-gray-700 text-white rounded hover:bg-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 text-sm flex items-center gap-1"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin"></i>
                Unpublishing...
              </>
            ) : (
              <>
                <i className="ri-eye-off-line"></i>
                Unpublish
              </>
            )}
          </button>
        )}
        {showSchedule && (
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 text-sm flex items-center gap-1"
          >
            <i className="ri-calendar-line"></i>
            Schedule
          </button>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Schedule Publication
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setScheduleDate('');
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedulePublish}
                disabled={loading || !scheduleDate}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
              >
                {loading ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

