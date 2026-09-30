import { CircleCheck, Pencil, Star, Trash2 } from 'lucide-react';
import { createElement } from 'react';
import { fn } from 'storybook/test';
import { Icon } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Interaction/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    iconNode: createElement(Star),
  },
};

export const Danger: Story = {
  args: {
    onPress: fn(),
    danger: true,
    iconNode: createElement(Trash2),
  },
};

export const Success: Story = {
  args: {
    onPress: fn(),
    success: true,
    iconNode: createElement(CircleCheck),
  },
};

export const Edit: Story = {
  args: {
    onPress: fn(),
    edit: true,
    iconNode: createElement(Pencil),
  },
};
