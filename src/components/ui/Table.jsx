import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import './Table.css';
import Button from './Button';

const PAGE_SIZE_DEFAULT = 10;

/**
 * Table — sortable, searchable, paginated data table.
 *
 * Props:
 *  - columns: [{ header, accessor, render? }]   (simple mode)
 *  - columns: [{ label, key, sortable?, render?, width? }]  (advanced mode)
 *  - data: array of row objects
 *  - searchable?: boolean — show built-in search bar (default false)
 *  - pageSize?: number   — rows per page (default 10; 0 = no pagination)
 *  - className?: string
 *  - emptyMessage?: string
 *
 * Legacy external pagination is still supported via `pagination` prop.
 */
export const Table = ({
  columns,
  data = [],
  searchable = false,
  pageSize: pageSizeProp = PAGE_SIZE_DEFAULT,
  // legacy external sort/pagination props kept for backwards compatibility
  sortColumn: externalSortCol,
  sortDirection: externalSortDir,
  onSort: externalOnSort,
  pagination: externalPagination,
  className = '',
  emptyMessage = 'No data available',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCol, setSortCol] = useState(externalSortCol || null);
  const [sortDir, setSortDir] = useState(externalSortDir || 'asc');
  const [page, setPage] = useState(1);

  // Normalize columns to unified shape
  const normalizedColumns = useMemo(() =>
    columns.map((col) => ({
      key: col.accessor || col.key,
      label: col.header || col.label || col.key,
      sortable: col.sortable || false,
      render: col.render || null,
      width: col.width || null,
    })), [columns]);

  // Search filter
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((row) =>
      normalizedColumns.some((col) => {
        const val = row[col.key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, searchQuery, normalizedColumns]);

  // Client-side sort
  const sorted = useMemo(() => {
    if (externalOnSort || !sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortCol] ?? '';
      const bv = b[sortCol] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir, externalOnSort]);

  // Pagination
  const useInternalPagination = !externalPagination && pageSizeProp > 0;
  const totalItems = sorted.length;
  const totalPages = useInternalPagination ? Math.ceil(totalItems / pageSizeProp) : 1;
  const visibleRows = useInternalPagination
    ? sorted.slice((page - 1) * pageSizeProp, page * pageSizeProp)
    : sorted;

  const handleSort = (key) => {
    if (externalOnSort) { externalOnSort(key); return; }
    setPage(1);
    if (sortCol === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const paginationData = externalPagination || (useInternalPagination ? {
    currentPage: page,
    pageSize: pageSizeProp,
    totalItems,
    onPageChange: setPage,
  } : null);

  return (
    <div className={`table-container ${className}`}>
      {searchable && (
        <div className="table-search-bar">
          <Search size={16} className="table-search-icon" />
          <input
            type="text"
            className="table-search-input"
            placeholder="Search table..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button className="table-search-clear" onClick={() => { setSearchQuery(''); setPage(1); }}>
              ×
            </button>
          )}
        </div>
      )}

      <div className="table-responsive-wrapper">
        <table className="table">
          <thead>
            <tr>
              {normalizedColumns.map((col, idx) => (
                <th
                  key={idx}
                  className={col.sortable ? 'sortable-header' : ''}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ width: col.width }}
                >
                  <div className="th-content">
                    {col.label}
                    {col.sortable && (externalSortCol || sortCol) === col.key && (
                      <span className="sort-icon">
                        {(externalSortDir || sortDir) === 'asc'
                          ? <ChevronUp size={14} />
                          : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {normalizedColumns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={normalizedColumns.length} className="table-empty-state">
                  {searchQuery ? `No results for "${searchQuery}"` : emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {paginationData && paginationData.totalItems > paginationData.pageSize && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing{' '}
            {Math.min((paginationData.currentPage - 1) * paginationData.pageSize + 1, paginationData.totalItems)}–
            {Math.min(paginationData.currentPage * paginationData.pageSize, paginationData.totalItems)}{' '}
            of {paginationData.totalItems}
          </div>
          <div className="pagination-controls">
            <Button
              variant="secondary"
              size="sm"
              disabled={paginationData.currentPage === 1}
              onClick={() => paginationData.onPageChange(paginationData.currentPage - 1)}
            >
              <ChevronLeft size={16} /> Prev
            </Button>
            <span className="pagination-page">{paginationData.currentPage} / {Math.ceil(paginationData.totalItems / paginationData.pageSize)}</span>
            <Button
              variant="secondary"
              size="sm"
              disabled={paginationData.currentPage * paginationData.pageSize >= paginationData.totalItems}
              onClick={() => paginationData.onPageChange(paginationData.currentPage + 1)}
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
