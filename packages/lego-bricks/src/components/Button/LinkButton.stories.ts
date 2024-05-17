import { LinkButton } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Interaction/LinkButton',
  component: LinkButton,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Link Button',
    href: '#',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    children: 'Link Button',
    isDisabled: true,
    href: '#',
  },
};

export const Secondary: Story = {
  args: {
    secondary: true,
    children: 'Link Button',
    href: '#',
  },
};

export const Dark: Story = {
  args: {
    dark: true,
    children: 'Dark',
    href: '#',
  },
};

export const Danger: Story = {
  args: {
    danger: true,
    children: 'Dangerous!',
    href: '#',
  },
};

export const Success: Story = {
  args: {
    children: 'Successful',
    href: '#',
  },
};

export const Flat: Story = {
  args: {
    flat: true,
    children: 'Link',
    href: '#',
  },
};

export const Ghost: Story = {
  args: {
    ghost: true,
    children: 'Ghost',
    href: '#',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large',
    href: '#',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small',
    href: '#',
  },
};
