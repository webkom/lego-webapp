import { Modal } from '@webkom/lego-bricks';
import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Input,
  Menu,
  MenuItem,
  TextField,
  useFilter,
} from 'react-aria-components';
import styles from './CommandPalette.module.css';
import type { ComponentProps } from 'react';

type MenuItemProps = ComponentProps<typeof MenuItem>;
const CommandItem = (props: MenuItemProps) => <MenuItem {...props} />;

const CommandPalette = () => {
  const commands = [
    { id: 'new-file', label: 'Create new file…' },
    { id: 'new-folder', label: 'Create new folder…' },
    { id: 'assign', label: 'Assign to…' },
    { id: 'assign-me', label: 'Assign to me' },
    { id: 'status', label: 'Change status…' },
    { id: 'priority', label: 'Change priority…' },
    { id: 'label-add', label: 'Add label…' },
    { id: 'label-remove', label: 'Remove label…' },
  ];

  const [isOpen, setOpen] = useState(false);
  const { contains } = useFilter({ sensitivity: 'base' });
  const isMac = useMemo(
    () =>
      typeof navigator === 'undefined'
        ? false
        : /mac(os|intosh)/i.test(navigator.userAgent),
    [],
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (isMac ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMac]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={setOpen} showCloseButton={false}>
        <Autocomplete filter={contains}>
          <TextField aria-label="Search commands" className={styles.inputField}>
            <Input autoFocus placeholder="Søk kommandoer..." />
          </TextField>
          <Menu items={commands}>
            {({ label }) => <CommandItem>{label}</CommandItem>}
          </Menu>
        </Autocomplete>
      </Modal>
    </>
  );
};

export default CommandPalette;
