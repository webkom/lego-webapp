import { Card } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Card> = {
  title: 'Layout/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    children: 'Default card',
  },
};

export const Danger: Story = {
  args: {
    severity: 'danger',
    children: 'Dangerous card',
  },
};

export const Info: Story = {
  args: {
    severity: 'info',
    children: 'Informative card',
  },
};

export const Success: Story = {
  args: {
    severity: 'success',
    children: 'Successful card',
  },
};

export const Warning: Story = {
  args: {
    severity: 'warning',
    children: 'Warning card',
  },
};

export const Hoverable: Story = {
  args: {
    isHoverable: true,
    children: 'Hover me!',
  },
};
