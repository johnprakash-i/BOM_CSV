import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { sortBOMItems } from '../utils/tableUtils';
import appConfig from '../config/app.config';
import type { BOMItem, SortConfig, TableState } from '../types/bom.types';
import { STORAGE_KEYS } from '../constants/app.constants';

type TableStateContextType = {
  tableState: TableState;
  sortedData: BOMItem[];
  updateTableData: (data: BOMItem[]) => void;
  handleSort: (columnId: string) => void;
  handleFreezeColumn: (index: number) => void;
  toggleColumnVisibility: (columnId: string) => void;
  setAllColumnsVisible: (visible: boolean) => void;
  resetTableState: () => void;
  isLoading: boolean;
};

const TableStateContext = createContext<TableStateContextType | null>(null);

export const TableStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TableState>({
    data: [],
    sortConfig: { columnId: null, direction: null },
    frozenColumnIndex: appConfig.features.enableLocalStorage
      ? parseInt(localStorage.getItem(STORAGE_KEYS.FROZEN_COLUMN) || '-1')
      : -1,
    columnVisibility: appConfig.features.enableLocalStorage
      ? JSON.parse(localStorage.getItem(STORAGE_KEYS.COLUMN_VISIBILITY) || '{}')
      : {},
    isLoading: false,
  });

  /* ---------------- persistence ---------------- */
  useEffect(() => {
    if (!appConfig.features.enableLocalStorage) return;
    localStorage.setItem(
      STORAGE_KEYS.TABLE_STATE,
      JSON.stringify({ data: state.data, sortConfig: state.sortConfig })
    );
  }, [state.data, state.sortConfig]);

  useEffect(() => {
    if (!appConfig.features.enableLocalStorage) return;
    localStorage.setItem(STORAGE_KEYS.FROZEN_COLUMN, state.frozenColumnIndex.toString());
  }, [state.frozenColumnIndex]);

  useEffect(() => {
    if (!appConfig.features.enableLocalStorage) return;
    localStorage.setItem(STORAGE_KEYS.COLUMN_VISIBILITY, JSON.stringify(state.columnVisibility));
  }, [state.columnVisibility]);

  /* ---------------- actions ---------------- */
  const updateTableData = useCallback((newData: BOMItem[]) => {
    setState(prev => ({ ...prev, data: newData, isLoading: false }));
  }, []);

  const resetTableState = useCallback(() => {
    setState({
      data: [],
      sortConfig: { columnId: null, direction: null },
      frozenColumnIndex: -1,
      columnVisibility: {},
      isLoading: false,
    });
  }, []);

  const handleSort = useCallback((columnId: string) => {
    setState(prev => {
      let direction: 'asc' | 'desc' | null = 'asc';

      if (prev.sortConfig.columnId === columnId) {
        if (prev.sortConfig.direction === 'asc') direction = 'desc';
        else if (prev.sortConfig.direction === 'desc') direction = null;
      }

      const newSortConfig: SortConfig = {
        columnId: direction ? columnId : null,
        direction,
      };

      return {
        ...prev,
        sortConfig: newSortConfig,
        data: sortBOMItems(prev.data, newSortConfig),
      };
    });
  }, []);

  const handleFreezeColumn = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      frozenColumnIndex: prev.frozenColumnIndex === index ? -1 : index,
    }));
  }, []);

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setState(prev => ({
      ...prev,
      columnVisibility: {
        ...prev.columnVisibility,
        [columnId]: !prev.columnVisibility[columnId],
      },
    }));
  }, []);

  const setAllColumnsVisible = useCallback((visible: boolean) => {
    setState(prev => {
      const cols = ['itemCode', 'material', 'quantity', 'estimatedRate'];
      for (let i = 1; i <= 5; i++) cols.push(`supplier${i}`);

      const visibility = { ...prev.columnVisibility };
      cols.forEach(c => (visibility[c] = visible));

      return { ...prev, columnVisibility: visibility };
    });
  }, []);

  const sortedData = sortBOMItems(state.data, state.sortConfig);

  return (
    <TableStateContext.Provider
      value={{
        tableState: state,
        sortedData,
        updateTableData,
        handleSort,
        handleFreezeColumn,
        toggleColumnVisibility,
        setAllColumnsVisible,
        resetTableState,
        isLoading: state.isLoading,
      }}
    >
      {children}
    </TableStateContext.Provider>
  );
};

export const useTableState = () => {
  const ctx = useContext(TableStateContext);
  if (!ctx) throw new Error('useTableState must be used inside TableStateProvider');
  return ctx;
};
