import { Icon } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Icon> = {
  title: 'Interaction/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Icon>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {},
};

export const Danger: Story = {
  args: {
    danger: true,
    name: 'trash',
  },
};

export const Success: Story = {
  args: {
    success: true,
    name: 'checkmark-circle-outline',
  },
};

export const Edit: Story = {
  args: {
    edit: true,
    name: 'pencil',
  },
};
