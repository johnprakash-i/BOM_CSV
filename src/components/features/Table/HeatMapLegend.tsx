import React from 'react';
import { FiInfo } from 'react-icons/fi';
import { useColorUtils } from '../../../hooks';
import { Tooltip } from '../../ui/Tooltip/Tooltip';


export const HeatmapLegend: React.FC = () => {
  const { generateHeatmapGradient } = useColorUtils();
  const gradientColors = generateHeatmapGradient(7);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Heatmap Legend:</span>
          <Tooltip content="Colors indicate relative rates from low (green) to high (red)">
            <FiInfo className="h-4 w-4 text-gray-400" />
          </Tooltip>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex h-6 rounded-lg overflow-hidden border border-gray-300">
            {gradientColors.map((color, index) => (
              <div
                key={index}
                className="w-8"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          
          <div className="flex text-xs text-gray-600 space-x-4">
            <span className="font-medium text-green-600">Low</span>
            <span className="font-medium text-yellow-600">Medium</span>
            <span className="font-medium text-red-600">High</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">L</span>
          </div>
          <span>Lowest rate in row</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">H</span>
          </div>
          <span>Highest rate in row</span>
        </div>
      </div>
    </div>
  );
};