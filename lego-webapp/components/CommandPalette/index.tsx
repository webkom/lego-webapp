import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Input,
  Modal,
  Dialog,
  DialogTrigger,
  Menu,
  MenuItem,
  ModalOverlay,
  TextField,
  useFilter,
  Button,
} from 'react-aria-components';
import styles from './CommandPalette.module.css';

type Command = { id: string; label: string };

const commands: Command[] = [
  { id: 'new-file', label: 'Create new file…' },
  { id: 'new-folder', label: 'Create new folder…' },
  { id: 'assign', label: 'Assign to…' },
  { id: 'assign-me', label: 'Assign to me' },
  { id: 'status', label: 'Change status…' },
  { id: 'priority', label: 'Change priority…' },
  { id: 'label-add', label: 'Add label…' },
  { id: 'label-remove', label: 'Remove label…' },
];

const CommandItem = (props: React.ComponentProps<typeof MenuItem>) => (
  <MenuItem {...props} className={styles.menuItem} />
);

const CommandPalette = () => {
  const [isOpen, setOpen] = useState(false);
  const { contains } = useFilter({ sensitivity: 'base' });

  const isMac = useMemo(
    () =>
      typeof navigator !== 'undefined' &&
      /mac(os|intosh)/i.test(navigator.userAgent),
    [],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
      <ModalOverlay className={styles.overlay} isDismissable>
        <Modal className={styles.modal}>
          <Dialog className={styles.dialog}>
            <div className={styles.container}>
              <Autocomplete filter={contains}>
                <div className={styles.topContainer}>
                  <TextField
                    aria-label="Search commands"
                    className={styles.textField}
                  >
                    <Input
                      placeholder="Søk på kommandoer…"
                      autoFocus
                      className={styles.input}
                    />
                  </TextField>
                </div>
                <Menu items={commands} className={styles.menu}>
                  {({ label }) => <CommandItem>{label}</CommandItem>}
                </Menu>
              </Autocomplete>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
};

export default CommandPalette;
