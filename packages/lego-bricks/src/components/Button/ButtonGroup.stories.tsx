import { Danger, Primary, PrimaryDisabled, Secondary } from './Button.stories';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Interaction/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: [
      <Button {...Primary.args} key="1" />,
      <Button {...Secondary.args} key="2" />,
    ],
  },
};

export const Vertical: Story = {
  args: {
    vertical: true,
    children: [
      <Button {...Primary.args} key="1" />,
      <Button {...Secondary.args} key="2" />,
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Using the `vertical` prop will stack the buttons vertically instead of horizontally. By default they are left-aligned, but they can be centered using `center`',
      },
    },
  },
};

export const HorizontalWrapping: Story = {
  args: {
    children: [
      <Button {...Danger.args} key="1" />,
      <Button {...Primary.args} key="2" />,
      <Button {...PrimaryDisabled.args} key="3" />,
      <Button {...Primary.args} key="4" />,
      <Button {...Secondary.args} key="5" />,
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'When width is constrained (like in the box below), buttons will wrap to the next line.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 400,
          height: 300,
          border: '1px solid black',
          resize: 'horizontal',
          overflow: 'auto',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
