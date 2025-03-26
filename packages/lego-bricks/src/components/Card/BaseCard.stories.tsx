import { BaseCard, CardContent, CardFooter } from './BaseCard';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Layout/BaseCard',
  component: BaseCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof BaseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <CardContent>Default card</CardContent>,
  },
};

export const Footer: Story = {
  args: {
    children: (
      <>
        <CardContent>Default card</CardContent>
        <CardFooter>Footer</CardFooter>
      </>
    ),
  },
};
