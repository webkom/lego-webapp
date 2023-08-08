import { LoadingIndicator } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LoadingIndicator> = {
  title: 'Misc/LoadingIndicator',
  component: LoadingIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoadingIndicator>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
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
