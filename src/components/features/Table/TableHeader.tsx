import React, { memo } from 'react';
import { FiChevronUp, FiChevronDown, FiEye, FiEyeOff, FiLock, FiUnlock, FiMoreVertical } from 'react-icons/fi';


import type { SortConfig, TableColumn } from '../../../types/bom.types';
import { Button } from '../../ui/Button/Button';
import { cn } from '../../../utils';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/Dropdown/Dropdown';
import { Tooltip } from '../../ui/Tooltip/Tooltip';


export interface TableHeaderProps {
  columns: TableColumn[];
  sortConfig: SortConfig;
  frozenColumnIndex: number;
  columnVisibility: { [key: string]: boolean };
  onSort: (columnId: string) => void;
  onFreezeColumn: (columnIndex: number) => void;
  onToggleColumnVisibility: (columnId: string) => void;
  onShowAllColumns: () => void;
  onHideAllColumns: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = memo(({
  columns,
  sortConfig,
  frozenColumnIndex,
  columnVisibility,
  onSort,
  onFreezeColumn,
  onToggleColumnVisibility,
  onShowAllColumns,
  onHideAllColumns,
}) => {
 
  const visibleColumns = columns.filter(col => 
    !col.hideable || columnVisibility[col.id] !== false
  );

  const getSortIcon = (columnId: string) => {
    if (sortConfig.columnId !== columnId) {
      return <FiChevronUp className="opacity-0 group-hover:opacity-50 transition-opacity" />;
    }
    return sortConfig.direction === 'asc' ? 
      <FiChevronUp className="text-blue-600" /> : 
      <FiChevronDown className="text-blue-600" />;
  };

  const getFreezeIcon = (columnIndex: number) => {
    return frozenColumnIndex >= columnIndex ? 
      <FiLock className="text-blue-600" /> : 
      <FiUnlock className="text-gray-400" />;
  };

  const handleColumnClick = (column: TableColumn, columnIndex: number) => {
    if (column.sortable) {
      onSort(column.id);
    }
  };

  const handleFreezeClick = (e: React.MouseEvent, columnIndex: number) => {
    e.stopPropagation();
    onFreezeColumn(columnIndex);
  };

  const ColumnContextMenu: React.FC<{ column: TableColumn; columnIndex: number }> = ({ 
    column, 
    columnIndex 
  }) => {
    const isVisible = columnVisibility[column.id] !== false;
    const isFrozen = frozenColumnIndex >= columnIndex;

    return (
      <DropdownMenu>
        <Tooltip content="Column options" >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <FiMoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-48">
          {column.sortable && (
            <DropdownMenuItem onClick={() => onSort(column.id)}>
              <FiChevronUp className="mr-2 h-4 w-4" />
              Sort {sortConfig.columnId === column.id && sortConfig.direction === 'asc' ? 'Descending' : 'Ascending'}
            </DropdownMenuItem>
          )}
          {column.freezable && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onFreezeColumn(columnIndex);
            }}>
              {isFrozen ? (
                <>
                  <FiUnlock className="mr-2 h-4 w-4" />
                  Unfreeze Column
                </>
              ) : (
                <>
                  <FiLock className="mr-2 h-4 w-4" />
                  Freeze Column
                </>
              )}
            </DropdownMenuItem>
          )}
          {column.hideable && (
            <DropdownMenuItem onClick={() => onToggleColumnVisibility(column.id)}>
              {isVisible ? (
                <>
                  <FiEyeOff className="mr-2 h-4 w-4" />
                  Hide Column
                </>
              ) : (
                <>
                  <FiEye className="mr-2 h-4 w-4" />
                  Show Column
                </>
              )}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onShowAllColumns}>
            <FiEye className="mr-2 h-4 w-4" />
            Show All Columns
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onHideAllColumns}>
            <FiEyeOff className="mr-2 h-4 w-4" />
            Hide All Columns
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        {visibleColumns.map((column, columnIndex) => {
          const isFrozen = frozenColumnIndex >= columnIndex;
          const isSortActive = sortConfig.columnId === column.id;
          const isVisible = columnVisibility[column.id] !== false;

          if (!isVisible) return null;

          return (
            <th
              key={column.id}
              className={cn(
                'py-3 px-4 text-left text-sm font-semibold text-gray-900 border-r border-gray-200 last:border-r-0',
                column.align === 'right' && 'text-right',
                column.align === 'center' && 'text-center',
                column.width,
                isFrozen && 'sticky top-0 z-30 bg-gray-50 shadow-right',
                column.sortable && 'cursor-pointer hover:bg-gray-100 group'
              )}
              style={{
                left: isFrozen 
                  ? columnIndex === 0 
                    ? '0' 
                    : columnIndex === 1 
                      ? 'var(--col-0-width)'
                      : `calc(var(--col-0-width) + var(--col-1-width))`
                  : undefined
              }}
              onClick={() => handleColumnClick(column, columnIndex)}
            >
              <div className={cn(
                'flex items-center justify-between',
                column.align === 'right' && 'flex-row-reverse',
                column.align === 'center' && 'justify-center'
              )}>
                <div className="flex items-center space-x-2">
                  <span>{column.label}</span>
                  {isSortActive && (
                    <span className="text-xs font-normal text-blue-600">
                      ({sortConfig.direction === 'asc' ? 'A-Z' : 'Z-A'})
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {column.sortable && getSortIcon(column.id)}
                  {column.freezable && (
                    <Tooltip content={isFrozen ? "Unfreeze column" : "Freeze column"} >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleFreezeClick(e, columnIndex)}
                      >
                        {getFreezeIcon(columnIndex)}
                      </Button>
                    </Tooltip>
                  )}
                  <ColumnContextMenu column={column} columnIndex={columnIndex} />
                </div>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';

export { TableHeader };