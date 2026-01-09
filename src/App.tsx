import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { TooltipProvider } from './components/ui/Tooltip/Tooltip';
import { ToastProvider } from './components/ui/Toaster/Toaster';
import { UploadPage } from './pages/UploadPage/UploadPage';
import { TablePage } from './pages/TablePage/TablePage';
import { TableStateProvider } from './context/TableContext';


function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <ToastProvider>
          <TableStateProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<UploadPage />} />
                <Route path="/table" element={<TablePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TableStateProvider>
        </ToastProvider>
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
