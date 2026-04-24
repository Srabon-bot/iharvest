import React from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import './Table.css';
import Button from './Button';

export const Table = ({
  columns,
  data,
  sortColumn,
  sortDirection,
  onSort,
  pagination,
  className = ''
}) => {
  return (
    <div className={`table-container ${className}`}>
      <div className="table-responsive-wrapper">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={index}
                  className={col.sortable ? 'sortable-header' : ''}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                  style={{ width: col.width }}
                >
                  <div className="th-content">
                    {col.label}
                    {col.sortable && sortColumn === col.key && (
                      <span className="sort-icon">
                        {sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="table-empty-state">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} results
          </div>
          <div className="pagination-controls">
            <Button 
              variant="secondary" 
              size="sm" 
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              <ChevronLeft size={16} /> Previous
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              disabled={pagination.currentPage * pagination.pageSize >= pagination.totalItems}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
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
