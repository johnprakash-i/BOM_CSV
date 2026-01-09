import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
import { Button } from '../Button/Button';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    hoverable: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a card description with some details.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          This is the main content area of the card. You can put any content here.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button className="ml-2">Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
  render: (args) => (
    <Card {...args} className="max-w-md">
      <CardContent className="pt-6">
        <p className="text-gray-600">Outlined card variant with border.</p>
      </CardContent>
    </Card>
  ),
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
  },
  render: (args) => (
    <Card {...args} className="max-w-md">
      <CardContent className="pt-6">
        <p className="text-gray-600">Elevated card with shadow.</p>
      </CardContent>
    </Card>
  ),
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
  },
  render: (args) => (
    <Card {...args} className="max-w-md">
      <CardContent className="pt-6">
        <p className="text-gray-600">Hover over this card to see the effect.</p>
      </CardContent>
    </Card>
  ),
};

export const DifferentPadding: Story = {
  render: () => (
    <div className="space-y-4">
      <Card padding="sm" className="max-w-md">
        <CardContent>
          <p className="text-gray-600">Small padding (p-3)</p>
        </CardContent>
      </Card>
      <Card padding="md" className="max-w-md">
        <CardContent>
          <p className="text-gray-600">Medium padding (p-6)</p>
        </CardContent>
      </Card>
      <Card padding="lg" className="max-w-md">
        <CardContent>
          <p className="text-gray-600">Large padding (p-8)</p>
        </CardContent>
      </Card>
    </div>
  ),
};