import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { FiUpload, FiDownload, FiCheck } from 'react-icons/fi';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Click me',
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: 'Upload CSV',
    leftIcon: <FiUpload />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: 'Download Report',
    rightIcon: <FiDownload />,
  },
};

export const Loading: Story = {
  args: {
    children: 'Processing...',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

export const IconButton: Story = {
  args: {
    'aria-label': 'Check',
    size: 'icon',
    children: <FiCheck />,
  },
};