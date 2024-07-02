import { LoadingIndicator } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Misc/LoadingIndicator',
  component: LoadingIndicator,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    loading: true,
    children: '🥳',
  },
};

export const Small: Story = {
  args: {
    loading: true,
    small: true,
  },
};

export const NoLongerLoading: Story = {
  args: {
    loading: false,
    children: 'Content',
  },
};
