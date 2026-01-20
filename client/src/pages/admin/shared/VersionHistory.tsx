import { useState, useEffect } from 'react';
import { versionsService } from '../../../services/apiService';
import { Modal } from './Modal';

interface Version {
  id: number;
  entityType: string;
  entityId: number;
  versionNumber: number;
  content: any;
  changes: any;
  action: string;
  isCurrent: boolean;
  notes: string | null;
  createdAt: string;
  creator?: {
    id: number;
    username: string;
    email: string;
  };
}

interface VersionHistoryProps {
  entityType: string;
  entityId: number;
  isOpen: boolean;
  onClose: () => void;
  onRevert?: (versionId: number) => void;
}

export const VersionHistory = ({
  entityType,
  entityId,
  isOpen,
  onClose,
  onRevert,
}: VersionHistoryProps) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<[number | null, number | null]>([null, null]);
  const [comparison, setComparison] = useState<any>(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    if (isOpen && entityId) {
      fetchVersions();
    }
  }, [isOpen, entityType, entityId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const data = await versionsService.getVersions(entityType, entityId);
      setVersions(data);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (selectedVersions[0] && selectedVersions[1]) {
      try {
        setComparing(true);
        const data = await versionsService.compareVersions(selectedVersions[0], selectedVersions[1]);
        setComparison(data);
      } catch (error) {
        console.error('Error comparing versions:', error);
      } finally {
        setComparing(false);
      }
    }
  };

  const handleRevert = async (versionId: number) => {
    if (window.confirm('Are you sure you want to revert to this version? This will replace the current content.')) {
      try {
        await versionsService.revertToVersion(versionId);
        if (onRevert) {
          onRevert(versionId);
        }
        fetchVersions();
      } catch (error) {
        console.error('Error reverting version:', error);
        alert('Failed to revert version. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Version History" size="xl">
      <div className="space-y-4">
        {/* Compare Versions */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Compare Versions</h3>
          <div className="flex gap-4">
            <select
              value={selectedVersions[0] || ''}
              onChange={(e) => setSelectedVersions([Number(e.target.value) || null, selectedVersions[1]])}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select version 1</option>
              {versions.map(v => (
                <option key={v.id} value={v.id}>
                  Version {v.versionNumber} - {formatDate(v.createdAt)}
                </option>
              ))}
            </select>
            <select
              value={selectedVersions[1] || ''}
              onChange={(e) => setSelectedVersions([selectedVersions[0], Number(e.target.value) || null])}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select version 2</option>
              {versions.map(v => (
                <option key={v.id} value={v.id}>
                  Version {v.versionNumber} - {formatDate(v.createdAt)}
                </option>
              ))}
            </select>
            <button
              onClick={handleCompare}
              disabled={!selectedVersions[0] || !selectedVersions[1] || comparing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {comparing ? 'Comparing...' : 'Compare'}
            </button>
          </div>
        </div>

        {/* Comparison Results */}
        {comparison && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Differences Found:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {Object.entries(comparison.differences || {}).map(([key, diff]: [string, any]) => (
                <div key={key} className="text-sm">
                  <div className="font-medium text-gray-700 dark:text-gray-300">{key}:</div>
                  <div className="pl-4 text-gray-600 dark:text-gray-400">
                    <div className="text-red-600 dark:text-red-400">- {JSON.stringify(diff.old)}</div>
                    <div className="text-green-600 dark:text-green-400">+ {JSON.stringify(diff.new)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Versions List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No version history available
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {versions.map((version) => (
              <div
                key={version.id}
                className={`p-4 rounded-lg border ${
                  version.isCurrent
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        Version {version.versionNumber}
                      </span>
                      {version.isCurrent && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                          Current
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                        {version.action}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div>
                        <i className="ri-user-line mr-1"></i>
                        {version.creator?.username || 'System'}
                      </div>
                      <div>
                        <i className="ri-time-line mr-1"></i>
                        {formatDate(version.createdAt)}
                      </div>
                      {version.notes && (
                        <div>
                          <i className="ri-file-text-line mr-1"></i>
                          {version.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  {!version.isCurrent && (
                    <button
                      onClick={() => handleRevert(version.id)}
                      className="ml-4 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                    >
                      Revert
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

