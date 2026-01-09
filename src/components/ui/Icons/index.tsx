import React from 'react';
import { FiUpload, FiDownload, FiTrash2, FiEdit, FiEye, FiEyeOff, FiFilter, FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight, FiX, FiCheck, FiAlertCircle, FiInfo, FiSettings, FiMenu, FiSearch, FiPlus, FiMinus, FiMoreVertical, FiGrid, FiList } from 'react-icons/fi';

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number;
  className?: string;
}

const createIcon = (Icon: React.ComponentType<IconProps>) => {
  const Component: React.FC<IconProps> = ({ size = 20, className, ...props }) => (
    <Icon size={size} className={className} {...props} />
  );
  Component.displayName = Icon.displayName || Icon.name;
  return Component;
};

export const UploadIcon = createIcon(FiUpload);
export const DownloadIcon = createIcon(FiDownload);
export const TrashIcon = createIcon(FiTrash2);
export const EditIcon = createIcon(FiEdit);
export const EyeIcon = createIcon(FiEye);
export const EyeOffIcon = createIcon(FiEyeOff);
export const FilterIcon = createIcon(FiFilter);
export const ChevronUpIcon = createIcon(FiChevronUp);
export const ChevronDownIcon = createIcon(FiChevronDown);
export const ChevronLeftIcon = createIcon(FiChevronLeft);
export const ChevronRightIcon = createIcon(FiChevronRight);
export const XIcon = createIcon(FiX);
export const CheckIcon = createIcon(FiCheck);
export const AlertCircleIcon = createIcon(FiAlertCircle);
export const InfoIcon = createIcon(FiInfo);
export const SettingsIcon = createIcon(FiSettings);
export const MenuIcon = createIcon(FiMenu);
export const SearchIcon = createIcon(FiSearch);
export const PlusIcon = createIcon(FiPlus);
export const MinusIcon = createIcon(FiMinus);
export const MoreVerticalIcon = createIcon(FiMoreVertical);
export const GridIcon = createIcon(FiGrid);
export const ListIcon = createIcon(FiList);

// Export all icons for easy import
export * from 'react-icons/fi';