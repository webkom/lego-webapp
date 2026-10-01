import { Cropper } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Interaction/Cropper',
  component: Cropper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Cropper>;

export default meta;
type Story = StoryObj<typeof meta>;

const redBallSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><circle cx="300" cy="200" r="150" fill="red"/></svg>';

const src = 'data:image/svg+xml,' + encodeURIComponent(redBallSvg);

export const Default: Story = {
  args: {
    src,
    aspectRatio: 1,
  },
};
