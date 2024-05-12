import { Button, DialogTrigger } from 'react-aria-components';
import { Modal } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Modal> = {
  title: 'Layout/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

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
