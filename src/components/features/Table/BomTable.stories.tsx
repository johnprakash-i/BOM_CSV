// import type { Meta, StoryObj } from '@storybook/react';
// import type { BOMTable } from './BomTable';
// import type { BOMItem } from '../../../types/bom.types';


// const meta: Meta<typeof BOMTable> = {
//   title: 'Features/BOMTable',
//   component: BOMTable,
//   tags: ['autodocs'],
//   decorators: [
//     (Story) => (
//       <div className="h-[600px] border border-gray-300 rounded-lg overflow-hidden">
//         <Story />
//       </div>
//     ),
//   ],
// };

// export default meta;
// type Story = StoryObj<typeof BOMTable>;

// // Generate mock data
// const generateMockData = (count: number): BOMItem[] => {
//   return Array.from({ length: count }, (_, index) => {
//     const supplierRates = Array.from({ length: 5 }, (_, supplierIndex) => {
//       const rate = Math.random() * 100 + 50;
//       const percentageDiff = Math.random() * 40 - 20;
//       return {
//         supplierId: `supplier${supplierIndex + 1}`,
//         rate,
//         percentageDiff,
//         heatmapColor: `rgb(${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)})`,
//       };
//     });

//     const rates = supplierRates.map(sr => sr.rate).filter((r): r is number => r !== null);
    
//     return {
//       id: `item-${index + 1}`,
//       itemCode: `ITEM-${String(index + 1).padStart(3, '0')}`,
//       material: `Material ${index + 1}`,
//       quantity: Math.floor(Math.random() * 1000) + 100,
//       estimatedRate: Math.random() * 100 + 50,
//       supplierRates,
//       minRate: Math.min(...rates),
//       maxRate: Math.max(...rates),
//     };
//   });
// };

// export const Default: Story = {
//   args: {
//     data: generateMockData(25),
//     isLoading: false,
//   },
// };

// export const Loading: Story = {
//   args: {
//     data: [],
//     isLoading: true,
//   },
// };

// export const Empty: Story = {
//   args: {
//     data: [],
//     isLoading: false,
//   },
// };

// export const WithFrozenColumns: Story = {
//   args: {
//     data: generateMockData(25),
//     frozenColumnIndex: 2, // Freeze first 3 columns
//   },
// };

// export const WithHiddenColumns: Story = {
//   args: {
//     data: generateMockData(25),
//     columnVisibility: {
//       supplier3: false,
//       supplier4: false,
//     },
//   },
// };

// export const WithSorting: Story = {
//   args: {
//     data: generateMockData(25),
//     sortConfig: {
//       columnId: 'estimatedRate',
//       direction: 'desc',
//     },
//   },
// };

// export const ManyRows: Story = {
//   args: {
//     data: generateMockData(150),
//   },
// };