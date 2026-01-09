import React, { useMemo, useState, useEffect } from 'react';

import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { TableControls } from './TableControls';
import type { BOMItem } from '../../../types/bom.types';
import { getAllColumns } from '../../../constants/table.constants';
import { PageLoader } from '../../ui/Loader/PageLoader';
import { cn } from '../../../utils';
import { TableFooter } from './TableFooter';
import { HeatmapLegend } from './HeatMapLegend';


export interface BOMTableProps {
  data: BOMItem[];
  isLoading?: boolean;
  onSort?: (columnId: string) => void;
  onFreezeColumn?: (columnIndex: number) => void;
  onToggleColumnVisibility?: (columnId: string) => void;
  onShowAllColumns?: () => void;
  onHideAllColumns?: () => void;
  onExport?: () => void;
  sortConfig?: {
    columnId: string | null;
    direction: 'asc' | 'desc' | null;
  };
  frozenColumnIndex?: number;
  columnVisibility?: { [key: string]: boolean };
  className?: string;
}

export const BOMTable: React.FC<BOMTableProps> = ({
  data,
  isLoading = false,
  onSort = () => {},
  onFreezeColumn = () => {},
  onToggleColumnVisibility = () => {},
  onShowAllColumns = () => {},
  onHideAllColumns = () => {},
  onExport = () => {},
  sortConfig = { columnId: null, direction: null },
  frozenColumnIndex = -1,
  columnVisibility = {},
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showPercentageDiff, setShowPercentageDiff] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const allColumns = useMemo(() => getAllColumns(), []);
  const visibleColumns = useMemo(() => 
    allColumns.filter(col => !col.hideable || columnVisibility[col.id] !== false),
    [allColumns, columnVisibility]
  );

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(item =>
      item.itemCode.toLowerCase().includes(query) ||
      item.material.toLowerCase().includes(query) ||
      item.supplierRates.some(sr => 
        sr.rate?.toString().includes(query)
      )
    );
  }, [data, searchQuery]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Calculate column widths for frozen columns
  useEffect(() => {
    if (frozenColumnIndex >= 0) {
      const updateColumnWidths = () => {
        visibleColumns.forEach((column, index) => {
          if (index <= frozenColumnIndex) {
            const element = document.querySelector(`th:nth-child(${index + 1})`);
            if (element) {
              const width = element.getBoundingClientRect().width;
              document.documentElement.style.setProperty(
                `--col-${index}-width`,
                `${width}px`
              );
            }
          }
        });
      };

      // Update initially and on window resize
      updateColumnWidths();
      window.addEventListener('resize', updateColumnWidths);
      return () => window.removeEventListener('resize', updateColumnWidths);
    }
  }, [frozenColumnIndex, visibleColumns]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
      tableContainer.scrollTop = 0;
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  if (isLoading) {
    return <PageLoader message="Loading table data..." />;
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Table Controls */}
      <TableControls
        columns={visibleColumns}
        frozenColumnIndex={frozenColumnIndex}
        columnVisibility={columnVisibility}
        onFreezeColumn={onFreezeColumn}
        onToggleColumnVisibility={onToggleColumnVisibility}
        onShowAllColumns={onShowAllColumns}
        onHideAllColumns={onHideAllColumns}
        onSearch={handleSearch}
        onExport={onExport}
        itemCount={data.length}
        visibleItemCount={filteredData.length}
        searchQuery={searchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showHeatmap={showHeatmap}
        onShowHeatmapChange={setShowHeatmap}
        showPercentageDiff={showPercentageDiff}
        onShowPercentageDiffChange={setShowPercentageDiff}
      />

      {/* Heatmap Legend */}
      {showHeatmap && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <HeatmapLegend />
        </div>
      )}

      {/* Table Container */}
      <div className="table-container flex-1 overflow-auto relative">
        <div className="min-w-full">
          <table className="w-full border-collapse">
            <TableHeader
              columns={visibleColumns}
              sortConfig={sortConfig}
              frozenColumnIndex={frozenColumnIndex}
              columnVisibility={columnVisibility}
              onSort={onSort}
              onFreezeColumn={onFreezeColumn}
              onToggleColumnVisibility={onToggleColumnVisibility}
              onShowAllColumns={onShowAllColumns}
              onHideAllColumns={onHideAllColumns}
            />
            <TableBody
              items={paginatedData}
              columns={visibleColumns}
              frozenColumnIndex={frozenColumnIndex}
              columnVisibility={columnVisibility}
            />
          </table>

          {paginatedData.length === 0 && filteredData.length > 0 && (
            <div className="p-8 text-center text-gray-500">
              No items match your search criteria.
            </div>
          )}
        </div>
      </div>

      {/* Table Footer with Pagination */}
      <TableFooter
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredData.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};