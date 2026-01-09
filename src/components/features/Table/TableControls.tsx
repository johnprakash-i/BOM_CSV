import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiLock, FiUnlock, FiFilter, FiDownload, FiGrid, FiList, FiSearch } from 'react-icons/fi';


import type { TableColumn } from '../../../types/bom.types';
import { getAllColumns } from '../../../constants/table.constants';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';
import { cn } from '../../../utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/Dropdown/Dropdown';
import { Tooltip } from '../../ui/Tooltip/Tooltip';
import { Switch } from '../../ui/Switch/Switch';



export interface TableControlsProps {
  columns: TableColumn[];
  frozenColumnIndex: number;
  columnVisibility: { [key: string]: boolean };
  onFreezeColumn: (columnIndex: number) => void;
  onToggleColumnVisibility: (columnId: string) => void;
  onShowAllColumns: () => void;
  onHideAllColumns: () => void;
  onSearch: (query: string) => void;
  onExport: () => void;
  itemCount: number;
  visibleItemCount: number;
  searchQuery: string;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  showHeatmap: boolean;
  onShowHeatmapChange: (show: boolean) => void;
  showPercentageDiff: boolean;
  onShowPercentageDiffChange: (show: boolean) => void;
}

export const TableControls: React.FC<TableControlsProps> = ({
  columns,
  frozenColumnIndex,
  columnVisibility,
  onFreezeColumn,
  onToggleColumnVisibility,
  onShowAllColumns,
  onHideAllColumns,
  onSearch,
  onExport,
  itemCount,
  visibleItemCount,
  searchQuery,
  viewMode,
  onViewModeChange,
  showHeatmap,
  onShowHeatmapChange,
  showPercentageDiff,
  onShowPercentageDiffChange,
}) => {
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const allColumns = getAllColumns();

  const hiddenColumnCount = allColumns.filter(col => 
    col.hideable && columnVisibility[col.id] === false
  ).length;

  const frozenColumnLabel = frozenColumnIndex >= 0 
    ? columns[frozenColumnIndex]?.label || `Column ${frozenColumnIndex + 1}`
    : 'None';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white border-b border-gray-200">
      {/* Left controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search items..."
            leftIcon={<FiSearch />}
            value={searchQuery}
            onChange={handleSearchChange}
            className="min-w-[200px]"
          />
        </div>

        {/* Column Management */}
        <DropdownMenu open={isColumnMenuOpen} onOpenChange={setIsColumnMenuOpen}>
          <Tooltip content="Column management">
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative">
                <FiGrid className="mr-2 h-4 w-4" />
                Columns
                {hiddenColumnCount > 0 && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {hiddenColumnCount} hidden
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
          </Tooltip>
          <DropdownMenuContent className="w-64" align="start">
            <DropdownMenuLabel>Column Management</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="max-h-64 overflow-y-auto p-1">
              {allColumns.map((column, index) => (
                <div
                  key={column.id}
                  className={cn(
                    'flex items-center justify-between px-2 py-2 rounded hover:bg-gray-100',
                    !column.hideable && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center space-x-2">
                    {column.freezable && (
                      <Tooltip content={frozenColumnIndex >= index ? "Unfreeze" : "Freeze"}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onFreezeColumn(index)}
                          disabled={!column.freezable}
                        >
                          {frozenColumnIndex >= index ? (
                            <FiLock className="h-3 w-3 text-blue-600" />
                          ) : (
                            <FiUnlock className="h-3 w-3 text-gray-400" />
                          )}
                        </Button>
                      </Tooltip>
                    )}
                    <span className="text-sm">{column.label}</span>
                  </div>
                  
                  {column.hideable && (
                    <Switch
                      checked={columnVisibility[column.id] !== false}
                      onCheckedChange={() => onToggleColumnVisibility(column.id)}
                    />
                  )}
                </div>
              ))}
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onShowAllColumns}>
                <FiEye className="mr-2 h-4 w-4" />
                Show All Columns
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onHideAllColumns}>
                <FiEyeOff className="mr-2 h-4 w-4" />
                Hide All Columns
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Freeze Info */}
        <div className="hidden md:flex items-center text-sm text-gray-600">
          <FiLock className="mr-1 h-4 w-4" />
          <span>Frozen: {frozenColumnLabel}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex flex-wrap items-center gap-3">
      

        {/* View Options */}
        <DropdownMenu open={isViewMenuOpen} onOpenChange={setIsViewMenuOpen}>
          <Tooltip content="View options">
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FiFilter className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
          </Tooltip>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Display Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="heatmap-toggle" className="text-sm font-medium">
                  Show Heatmap
                </label>
                <Switch
                  id="heatmap-toggle"
                  checked={showHeatmap}
                  onCheckedChange={onShowHeatmapChange}
                />
              </div>
       
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export */}
        <Tooltip content="Export data">
          <Button variant="outline" onClick={onExport}>
            <FiDownload className="mr-2 h-4 w-4" />
            Export
          </Button>
        </Tooltip>

     
      </div>
    </div>
  );
};