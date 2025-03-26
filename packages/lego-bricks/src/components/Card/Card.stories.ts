import styles from './Card.stories.module.css';
import { Card } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Layout/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default card',
  },
};

export const Skeleton: Story = {
  args: {
    children: 'Default card',
    skeleton: true,
    className: styles.skeletonCard,
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
