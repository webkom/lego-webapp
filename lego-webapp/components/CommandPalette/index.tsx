import { Icon } from '@webkom/lego-bricks';
import { CornerDownRight, Command } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Input,
  Modal,
  Dialog,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuSection,
  Header,
  ModalOverlay,
  TextField,
  Collection,
  useFilter,
} from 'react-aria-components';
import styles from './CommandPalette.module.css';
import commands from './commands';

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
        <Modal>
          <Dialog>
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
                <Menu
                  items={commands}
                  selectionMode="single"
                  className={styles.menu}
                  onSelectionChange={(keys) => {
                    const [id] = Array.from(keys);
                    const cmd = commands
                      .flatMap((s) => s.items)
                      .find((c) => c.id === id);
                    cmd?.action();
                    setOpen(false);
                  }}
                >
                  {(section) => (
                    <MenuSection id={section.name}>
                      <Header className={styles.menuHeader}>
                        {section.name}
                      </Header>
                      <Collection items={section.items}>
                        {(item) => (
                          <CommandItem id={item.id} textValue={item.label}>
                            {({ isSelected, isFocused, isHovered }) => (
                              <>
                                {(isSelected || isFocused || isHovered) &&
                                  section.name === 'Navigasjon' && (
                                    <Icon
                                      iconNode={<CornerDownRight />}
                                      size={16}
                                    />
                                  )}
                                {(isSelected || isFocused || isHovered) &&
                                  section.name === 'Kommandoer' && (
                                    <Icon iconNode={<Command />} size={16} />
                                  )}
                                <span>{item.label}</span>
                              </>
                            )}
                          </CommandItem>
                        )}
                      </Collection>
                    </MenuSection>
                  )}
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
