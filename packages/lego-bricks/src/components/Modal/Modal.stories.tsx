import { Button, DialogTrigger } from 'react-aria-components';
import { Modal } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Layout/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonTriggeredModal: Story = {
  decorators: [
    (Story) => (
      <DialogTrigger>
        <Button>Open modal</Button>
        <Story />
      </DialogTrigger>
    ),
  ],
  args: {
    title: 'Modal title',
    children: 'Modal content',
  },
};

export const ControlledModal: Story = {
  args: {
    title: 'Modal title',
    children: 'Modal content',
    isOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Change the `isOpen` arg to `true` to open the modal',
      },
    },
  },
};
