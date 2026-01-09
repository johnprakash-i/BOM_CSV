import React, { memo } from 'react';
import { useColorUtils } from '../../../hooks';
import type { BOMItem, TableColumn } from '../../../types/bom.types';
import { cn, formatNumber, formatPercentageDiff, getHeatmapAccessibilityText } from '../../../utils';
import { InfoIcon } from '../../ui/Icons';
import { Tooltip } from '../../ui/Tooltip/Tooltip';



export interface TableBodyProps {
  items: BOMItem[];
  columns: TableColumn[];
  frozenColumnIndex: number;
  columnVisibility: { [key: string]: boolean };
}

const TableBody: React.FC<TableBodyProps> = memo(({
  items,
  columns,
  frozenColumnIndex,
  columnVisibility,
}) => {
  const { getContrastColor } = useColorUtils();
  const visibleColumns = columns.filter(col => 
    !col.hideable || columnVisibility[col.id] !== false
  );

  const renderCellContent = (item: BOMItem, column: TableColumn) => {
    switch (column.key) {
      case 'itemCode':
        return (
          <div className="font-medium text-gray-900">
            {item.itemCode}
          </div>
        );

      case 'material':
        return (
          <div className="text-gray-700">
            {item.material}
          </div>
        );

      case 'quantity':
        return (
          <div className="text-right font-mono">
            {formatNumber(item.quantity, 0)}
          </div>
        );

      case 'estimatedRate':
        return (
          <div className="text-right font-mono">
            <div className="font-semibold text-gray-900">
              {formatNumber(item.estimatedRate)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Base rate
            </div>
          </div>
        );

      case 'supplier':
        // Extract supplier index from column id (supplier1 -> index 0)
        const supplierIndex = parseInt(column.id.replace('supplier', '')) - 1;
        const supplierRate = item.supplierRates[supplierIndex];
        
        if (!supplierRate || supplierRate.rate === null) {
          return (
            <div className="text-right">
              <span className="text-gray-400 italic">-</span>
            </div>
          );
        }

        const backgroundColor = supplierRate.heatmapColor;
        const textColor = getContrastColor(backgroundColor);
        const isMinRate = supplierRate.rate === item.minRate;
        const isMaxRate = supplierRate.rate === item.maxRate;

        return (
          <Tooltip
            content={getHeatmapAccessibilityText(
              supplierRate.rate,
              item.minRate,
              item.maxRate,
              item.estimatedRate
            )}
            // side="top"
          >
            <div className="relative">
              <div
                className={cn(
                  'p-3 rounded-lg border transition-all duration-200 hover:shadow-md',
                  'flex flex-col items-end justify-center',
                  isMinRate && 'ring-2 ring-green-200 ring-offset-1',
                  isMaxRate && 'ring-2 ring-red-200 ring-offset-1'
                )}
                style={{
                  backgroundColor,
                  color: textColor,
                  borderColor: `rgba(0,0,0,0.1)`,
                }}
              >
                <div className="font-mono font-bold text-lg">
                  {formatNumber(supplierRate.rate)}
                </div>
                
                {supplierRate.percentageDiff !== null && (
                  <div className={cn(
                    'text-xs font-semibold mt-1 px-2 py-0.5 rounded-full',
                    Math.abs(supplierRate.percentageDiff) < 0.1 && 'bg-gray-100 text-gray-700',
                    supplierRate.percentageDiff > 0 && supplierRate.percentageDiff < 10 && 'bg-yellow-100 text-yellow-800',
                    supplierRate.percentageDiff >= 10 && 'bg-red-100 text-red-800',
                    supplierRate.percentageDiff < 0 && supplierRate.percentageDiff > -10 && 'bg-green-50 text-green-800',
                    supplierRate.percentageDiff <= -10 && 'bg-green-100 text-green-800'
                  )}>
                    {formatPercentageDiff(supplierRate.percentageDiff)}
                  </div>
                )}

                {(isMinRate || isMaxRate) && (
                  <div className={cn(
                    'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center',
                    isMinRate ? 'bg-green-500' : 'bg-red-500'
                  )}>
                    <span className="text-xs font-bold text-white">
                      {isMinRate ? 'L' : 'H'}
                    </span>
                  </div>
                )}
              </div>
              
              {Math.abs(supplierRate.percentageDiff || 0) > 20 && (
                <div className="absolute -top-1 -left-1">
                  <InfoIcon className="h-4 w-4 text-blue-500" />
                </div>
              )}
            </div>
          </Tooltip>
        );

      default:
        return null;
    }
  };

  if (items.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={visibleColumns.length} className="py-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-gray-400 text-lg">
                No data available
              </div>
              <p className="text-gray-500 max-w-md">
                Upload a CSV file or adjust your filters to see data.
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {items.map((item, rowIndex) => (
        <tr
          key={item.id}
          className={cn(
            'hover:bg-gray-50 transition-colors',
            rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
          )}
        >
          {visibleColumns.map((column, columnIndex) => {
            const isFrozen = frozenColumnIndex >= columnIndex;
            const isVisible = columnVisibility[column.id] !== false;

            if (!isVisible) return null;

            return (
              <td
                key={`${item.id}-${column.id}`}
                className={cn(
                  'py-3 px-4 border-r border-gray-200 last:border-r-0',
                  column.align === 'right' && 'text-right',
                  column.align === 'center' && 'text-center',
                  column.width,
                  isFrozen && 'sticky left-0 z-20 bg-inherit shadow-right'
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
              >
                {renderCellContent(item, column)}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
});

TableBody.displayName = 'TableBody';

export { TableBody };