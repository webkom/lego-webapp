import { Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import { Button } from '../../Button';
import { Icon } from '../../Icon';
import type { MenuItemProps } from 'react-aria-components';

export type Action = {
  title: string;
  actionGrant?: string | string[];
} & MenuItemProps;

type Props = {
  actions: Action[];
  actionGrant?: string[];
};

export const ActionMenu = ({ actions, actionGrant }: Props) => {
  actions = actions.filter((action) => {
    if (!action.actionGrant) {
      return true;
    }
    const requiredActionGrants = Array.isArray(action.actionGrant)
      ? action.actionGrant
      : [action.actionGrant];

    for (const requiredActionGrant of requiredActionGrants) {
      if (!actionGrant?.includes(requiredActionGrant)) {
        return false;
      }
    }
    return true;
  });

  return (
    <MenuTrigger>
      <Button size="large" aria-label="Menu">
        <Icon name="admin" size={26} />
      </Button>
      <Popover>
        <Menu>
          {actions.map((action) => (
            <MenuItem key={action.title} {...action}>
              {action.title}
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
};
