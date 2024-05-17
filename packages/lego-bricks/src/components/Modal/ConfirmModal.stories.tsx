import { Button } from '../Button';
import { ConfirmModal } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Layout/ConfirmModal',
  component: ConfirmModal,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

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
