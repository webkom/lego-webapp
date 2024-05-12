import { Button } from '@webkom/lego-bricks';
import { ConfirmModal } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ConfirmModal> = {
  title: 'Layout/ConfirmModal',
  component: ConfirmModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Normal: Story = {
  args: {
    title: 'Er du sikker?',
    message: 'Ikke gjør noe du kommer til å angre på!',
    children: ({ openConfirmModal }) => (
      <Button onPress={openConfirmModal}>Slett...</Button>
    ),
  },
};

export const NotDangerous: Story = {
  args: {
    title: 'Vil du gjøre dette?',
    message: 'Er du sikker på at du vil gjøre dette?',
    danger: false,
    children: ({ openConfirmModal }) => (
      <Button onPress={openConfirmModal}>Slett...</Button>
    ),
  },
};

export const CloseOnConfirm: Story = {
  args: {
    title: 'Er du sikker?',
    message: 'Ikke gjør noe du kommer til å angre på!',
    closeOnConfirm: true,
    children: ({ openConfirmModal }) => (
      <Button onPress={openConfirmModal}>Slett...</Button>
    ),
  },
};
