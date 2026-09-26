import { LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { Icon } from '../Icon';
import { Dropdown } from '.';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';

const meta = {
  title: 'Interaction/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  args: {
    show: false,
    toggle: () => {},
  },
  render: function Render(args: ComponentProps<typeof Dropdown>) {
    const [show, setShow] = useState(args.show);
    return <Dropdown {...args} show={show} toggle={() => setShow(!show)} />;
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Menu: Story = {
  args: {
    triggerComponent: 'Åpne meny',
    closeOnContentClick: true,
    children: (
      <Dropdown.List>
        <Dropdown.ListItem>
          <button>
            Profil
            <Icon iconNode={<User />} />
          </button>
        </Dropdown.ListItem>
        <Dropdown.ListItem>
          <button>
            Innstillinger
            <Icon iconNode={<Settings />} />
          </button>
        </Dropdown.ListItem>
        <Dropdown.Divider />
        <Dropdown.ListItem danger>
          <button>
            Logg ut
            <Icon iconNode={<LogOut />} />
          </button>
        </Dropdown.ListItem>
      </Dropdown.List>
    ),
  },
};

export const IconTrigger: Story = {
  args: {
    iconName: 'ellipsis-horizontal',
    closeOnContentClick: true,
    children: (
      <Dropdown.List>
        <Dropdown.ListItem>
          <button>Rediger</button>
        </Dropdown.ListItem>
        <Dropdown.ListItem danger>
          <button>Slett</button>
        </Dropdown.ListItem>
      </Dropdown.List>
    ),
  },
};

export const CustomContent: Story = {
  args: {
    triggerComponent: 'Vis innhold',
    children: (
      <button className={Dropdown.itemClassName}>
        Any element can use <code>Dropdown.itemClassName</code>
      </button>
    ),
  },
};
