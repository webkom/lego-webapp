import { Button } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Interaction/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    children: 'Button',
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
    children: 'Link',
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
    pending: true,
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
