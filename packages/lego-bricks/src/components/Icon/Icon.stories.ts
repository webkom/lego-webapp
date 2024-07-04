import { fn } from '@storybook/test';
import { Icon } from '.';
import type { Meta, StoryObj } from '@storybook/react';

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
  args: {},
};

export const Danger: Story = {
  args: {
    onClick: fn(),
    danger: true,
    name: 'trash',
  },
};

export const Success: Story = {
  args: {
    onClick: fn(),
    success: true,
    name: 'checkmark-circle-outline',
  },
};

export const Edit: Story = {
  args: {
    onClick: fn(),
    edit: true,
    name: 'pencil',
  },
};
