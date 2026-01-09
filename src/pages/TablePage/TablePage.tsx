import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiUpload, FiSettings, FiHelpCircle } from 'react-icons/fi';
import { useTablePerformance } from '../../hooks';
import { Button, Card, PageLoader } from '../../components';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/Dropdown/Dropdown';
import { Tooltip } from '../../components/ui/Tooltip/Tooltip';
import { BOMTable } from '../../components/features/Table/BomTable';
import { toast } from '../../components/ui/Toaster/Toaster';
import { useTableState } from '../../context/TableContext';



export const TablePage: React.FC = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const {
    tableState,
    sortedData,
    handleSort,
    handleFreezeColumn,
    toggleColumnVisibility,
    setAllColumnsVisible,
    resetTableState,
    isLoading,
  } = useTableState();

  const { columnStats } = useTablePerformance(sortedData);
console.log(tableState)
  // Check if we have data
  useEffect(() => {
    if (tableState.data.length === 0 && !isLoading) {
      toast.warning({
        title: 'No data availabless',
        description: 'Please upload a CSV file first',
      });
      navigate('/');
    }
  }, [tableState.data.length, isLoading, navigate]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Create CSV content
      const headers = [
        'Item Code',
        'Material',
        'Quantity',
        'Estimated Rate',
        ...Array.from({ length: 5 }, (_, i) => `Supplier ${i + 1} Rate`),
        'Minimum Rate',
        'Maximum Rate',
        'Best Supplier',
      ];

      const rows = sortedData.map(item => {
        const rates = item.supplierRates.map(sr => sr.rate);
        const minRate = Math.min(...rates.filter((r): r is number => r !== null));
        const bestSupplierIndex = rates.findIndex(r => r === minRate);
        
        return [
          item.itemCode,
          item.material,
          item.quantity.toString(),
          item.estimatedRate.toFixed(2),
          ...item.supplierRates.map(sr => sr.rate?.toFixed(2) || ''),
          minRate.toFixed(2),
          Math.max(...rates.filter((r): r is number => r !== null)).toFixed(2),
          bestSupplierIndex >= 0 ? `Supplier ${bestSupplierIndex + 1}` : 'N/A',
        ];
      });

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bom-analysis-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success({
        title: 'Export successful',
        description: 'CSV file downloaded',
      });
    } catch (error) {
      toast.error({
        title: 'Export failed',
        description: 'Failed to export data',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetView = () => {
    setAllColumnsVisible(true);
    handleFreezeColumn(-1);
    toast.info({
      title: 'View reset',
      description: 'All columns shown and freeze removed',
    });
  };

  const handleUploadNew = () => {
    resetTableState();
    navigate('/');
  };

  const handleShowAllColumns = () => {
    setAllColumnsVisible(true);
 toast.info({ title: 'All columns shown' });


  };

  const handleHideAllColumns = () => {
    setAllColumnsVisible(false);
  toast.info({ title: 'All optional columns hidden' });

  };

  if (isLoading && tableState.data.length === 0) {
    return <PageLoader message="Loading table data..." />;
  }

  if (tableState.data.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Data Available
            </h2>
            <p className="text-gray-600 mb-6">
              Please upload a CSV file to view the BOM analysis.
            </p>
            <Button onClick={() => navigate('/')} leftIcon={<FiUpload />}>
              Go to Upload
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="md:hidden"
              >
                <FiArrowLeft />
              </Button>
              
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-gray-900">
                  BOM Analysis Table
                </h1>
             
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              <Tooltip content="Help & Instructions">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <FiHelpCircle />
                </Button>
              </Tooltip>

              <Tooltip content="Export to CSV">
                <Button
                  variant="outline"
                  leftIcon={<FiDownload />}
                  onClick={handleExport}
                  loading={isExporting}
                >
                  <span className="hidden md:inline">Export</span>
                </Button>
              </Tooltip>

              <DropdownMenu>
                <Tooltip content="More options">
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <FiSettings />
                    </Button>
                  </DropdownMenuTrigger>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleUploadNew}>
                    <FiUpload className="mr-2 h-4 w-4" />
                    Upload New File
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShowAllColumns}>
                    <FiHelpCircle className="mr-2 h-4 w-4" />
                    Show All Columns
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleHideAllColumns}>
                    <FiHelpCircle className="mr-2 h-4 w-4" />
                    Hide Optional Columns
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleResetView}>
                    <FiHelpCircle className="mr-2 h-4 w-4" />
                    Reset View
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    <FiArrowLeft className="mr-2 h-4 w-4" />
                    Back to Upload
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Help Panel */}
        {showHelp && (
          <Card className="mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Table Guide</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowHelp(false)}>
                  Close
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Heatmap Colors</h4>
                  <p>Cells are colored from green (lowest rate) to red (highest rate).</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Freeze Columns</h4>
                  <p>Click the lock icon in column headers to freeze columns for horizontal scrolling.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Sort & Filter</h4>
                  <p>Click column headers to sort. Use the search box to filter items.</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Summary */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Total Items</div>
            <div className="text-2xl font-bold text-gray-900">{sortedData.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Avg Estimated Rate</div>
            <div className="text-2xl font-bold text-gray-900">
              {columnStats.estimatedRate.avg.toFixed(2)}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Best Avg Supplier</div>
            <div className="text-2xl font-bold text-green-600">
              Supplier {columnStats.suppliers.findIndex(s => s.avg === Math.min(...columnStats.suppliers.map(s => s.avg))) + 1}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Highest Variation</div>
            <div className="text-2xl font-bold text-red-600">
              {Math.max(...columnStats.suppliers.map(s => s.max - s.min)).toFixed(2)}
            </div>
          </Card>
        </div>

        {/* Main Table */}
        <Card className="overflow-hidden">
          <BOMTable
            data={sortedData}
            isLoading={isLoading}
            onSort={handleSort}
            onFreezeColumn={handleFreezeColumn}
            onToggleColumnVisibility={toggleColumnVisibility}
            onShowAllColumns={handleShowAllColumns}
            onHideAllColumns={handleHideAllColumns}
            onExport={handleExport}
            sortConfig={tableState.sortConfig}
            frozenColumnIndex={tableState.frozenColumnIndex}
            columnVisibility={tableState.columnVisibility}
            className="h-[calc(100vh-300px)]"
          />
        </Card>

        {/* Footer Notes */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Showing {sortedData.length} items • Use the controls above to freeze columns, show/hide columns, and sort data.
          </p>
          <p className="mt-1">
            <Button variant="link" size="sm" onClick={() => navigate('/')}>
              ← Upload a different file
            </Button>
          </p>
        </div>
      </main>
    </div>
  );
};