import { fn } from '@storybook/test';
import { Button } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Interaction/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: {
    onPress: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    children: 'Button',
    disabled: true,
  },
};

export const Secondary: Story = {
  args: {
    secondary: true,
    children: 'Button',
  },
};

export const Dark: Story = {
  args: {
    dark: true,
    children: 'Dark',
  },
};

export const Danger: Story = {
  args: {
    danger: true,
    children: 'Dangerous!',
  },
};

export const Success: Story = {
  args: {
    submit: true,
    children: 'Successful',
  },
};

export const Flat: Story = {
  args: {
    flat: true,
    children: 'Flat',
  },
};

export const Ghost: Story = {
  args: {
    ghost: true,
    children: 'Ghost',
  },
};

export const Pending: Story = {
  args: {
    isPending: true,
    children: 'Pending...',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small',
  },
};
