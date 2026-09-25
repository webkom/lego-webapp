import { Button } from '../Button';
import { Icon } from '../Icon';
import { Accordion } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';

const meta = {
  title: 'Interaction/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    triggerComponent: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const triggerComponent: ComponentProps<
  typeof Accordion
>['triggerComponent'] = ({ onClick, open, rotateClassName }) => (
  <Button onPress={onClick}>
    {open ? 'Skjul' : 'Vis'}{' '}
    <Icon name="chevron-forward-outline" className={rotateClassName} />
  </Button>
);
const children = (
  <div>
    {Array.from(Array(8).keys()).map((line, index) => (
      <p key={index}>Line {line}</p>
    ))}
  </div>
);

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    triggerComponent,
    children,
  },
};

export const InitiallyOpened: Story = {
  args: {
    triggerComponent,
    children,
    defaultOpen: true,
  },
};

export const Animated: Story = {
  args: {
    triggerComponent,
    children,
    animated: true,
  },
};

export const WithoutAnimation: Story = {
  args: {
    triggerComponent,
    children,
    animated: false,
  },
};
