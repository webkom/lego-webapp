import { Danger, Primary, PrimaryDisabled, Secondary } from './Button.stories';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Interaction/ButtonGroup',
  component: ButtonGroup,
  subcomponents: {
    Button,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <ButtonGroup {...args}>
      <Button {...Primary.args} />
      <Button {...Secondary.args} />
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  args: {
    vertical: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Using the `vertical` prop will stack the buttons vertically instead of horizontally. By default they are left-aligned, but they can be centered using `center`',
      },
    },
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button {...Primary.args} />
      <Button {...Secondary.args} />
    </ButtonGroup>
  ),
};

export const HorizontalWrapping: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'When width is constrained (like in the box below), buttons will wrap to the next line.',
      },
    },
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button {...Danger.args} />
      <Button {...Primary.args} />
      <Button {...PrimaryDisabled.args} />
      <Button {...Primary.args} />
      <Button {...Secondary.args} />
    </ButtonGroup>
  ),
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
