import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { FiSearch, FiMail } from 'react-icons/fi';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'date'],
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
      defaultValue: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    type: 'password',
    helperText: 'Must be at least 8 characters',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    error: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: <FiSearch />,
  },
};

export const WithIcons: Story = {
  args: {
    label: 'Email',
    type: 'email',
    leftIcon: <FiMail />,
    placeholder: 'you@example.com',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    value: 'Read-only value',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    required: true,
    placeholder: 'This field is required',
  },
};