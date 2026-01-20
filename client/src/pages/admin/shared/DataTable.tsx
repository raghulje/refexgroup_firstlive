import { useState } from 'react';

interface DataTableProps {
  title?: string;
  data: any[];
  columns: Array<{
    key: string;
    header: string;
    render?: (value: any, item?: any) => React.ReactNode;
    sortable?: boolean;
  }>;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onDragDrop?: (draggedId: number, targetId: number) => void;
  draggable?: boolean;
  searchable?: boolean;
  onSearch?: (query: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export const DataTable = ({ 
  title, 
  data, 
  columns, 
  onEdit, 
  onDelete,
  onDragDrop,
  draggable = false,
  searchable = false,
  onSearch,
  loading = false,
  emptyMessage = 'No data available',
  emptyIcon = 'ri-inbox-line'
}: DataTableProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal > bVal ? 1 : -1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const filteredData = searchable && searchQuery
    ? sortedData.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : sortedData;

  const handleDragStart = (e: React.DragEvent, itemId: number) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, itemId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const target = e.currentTarget;
    if (draggedItem !== null && draggedItem !== itemId) {
      target.classList.add('opacity-50', 'bg-blue-50');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('opacity-50', 'bg-blue-50');
    if (draggedItem !== null && draggedItem !== targetId && onDragDrop) {
      onDragDrop(draggedItem, targetId);
    }
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    document.querySelectorAll('tr').forEach(row => {
      row.classList.remove('opacity-50', 'bg-blue-50');
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      {(title || searchable) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center">
            {title && (
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
            )}
            {searchable && (
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="overflow-x-auto scrollbar-hide">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <i className="ri-loader-4-line animate-spin text-4xl text-gray-400 dark:text-gray-500 mb-2"></i>
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {draggable && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-12"></th>
                )}
                {columns.map((col, index) => (
                  <th 
                    key={index} 
                    className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ${
                      col.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none' : ''
                    }`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.header}
                      {col.sortable && sortColumn === col.key && (
                        <i className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-line text-xs`}></i>
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    ACTIONS
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0) + (draggable ? 1 : 0)} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <i className={`${emptyIcon} text-4xl text-gray-300 dark:text-gray-600 mb-2`}></i>
                      <p className="text-sm">{emptyMessage}</p>
                      {searchable && searchQuery && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">No results found for "{searchQuery}"</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr 
                    key={item.id || index} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                      draggable ? 'cursor-move' : ''
                    } ${draggedItem === item.id ? 'opacity-50' : ''}`}
                    draggable={draggable}
                    onDragStart={draggable ? (e) => handleDragStart(e, item.id) : undefined}
                    onDragOver={draggable ? (e) => handleDragOver(e, item.id) : undefined}
                    onDragLeave={draggable ? handleDragLeave : undefined}
                    onDrop={draggable ? (e) => handleDrop(e, item.id) : undefined}
                    onDragEnd={draggable ? handleDragEnd : undefined}
                  >
                    {draggable && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <i className="ri-drag-move-2-line text-gray-400 dark:text-gray-500 text-xl"></i>
                      </td>
                    )}
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {col.render ? col.render(item[col.key], item) : (item[col.key] || '-')}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30"
                              title="Edit"
                            >
                              <i className="ri-pencil-line text-lg"></i>
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30"
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line text-lg"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {searchable && filteredData.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredData.length} of {data.length} items
          {searchQuery && ` (filtered)`}
        </div>
      )}
    </div>
  );
};

