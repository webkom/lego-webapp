import { Icon } from '@webkom/lego-bricks';
import { ArrowDown, ArrowUp, CornerDownRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
  Input,
  Modal,
  Dialog,
  Menu,
  MenuItem,
  MenuSection,
  Header,
  ModalOverlay,
  TextField,
  Collection,
  Button,
  useFilter,
  Key,
} from 'react-aria-components';
import { recordCommandUsage } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import styles from './CommandPalette.module.css';
import createCommands from './commands';

const CommandItem = (props: React.ComponentProps<typeof MenuItem>) => (
  <MenuItem {...props} className={styles.menuItem} />
);

const CommandPalette = () => {
  const [isOpen, setOpen] = useState(false);
  const { contains } = useFilter({ sensitivity: 'base' });
  const dispatch = useAppDispatch();
  const suggestionIds = useCurrentUser()?.commandSuggestions;

  const commands = createCommands(dispatch, suggestionIds);
  const allItems = commands.flatMap((s) => s.items);

  const isMac =
    typeof window !== 'undefined' &&
    /mac(os|intosh)/i.test(navigator.userAgent);

  const togglePalette = useCallback(() => setOpen((prev) => !prev), []);
  const closePalette = useCallback(() => setOpen(false), []);

  const handleCommandSelect = useCallback(
    (key: Key) => {
      const id = String(key);
      const cmd = allItems.find((c) => c.id === id);
      if (!cmd) return;

      dispatch(recordCommandUsage(cmd.id));
      cmd.action();
      closePalette();
    },
    [allItems, dispatch, closePalette],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (isMac) {
        if (key === 'k' && e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          togglePalette();
          return;
        }
      } else {
        if (key === 'k' && e.ctrlKey && e.shiftKey && !e.altKey) {
          e.preventDefault();
          togglePalette();
          return;
        }
      }

      if (!isOpen) return;

      if (isMac) {
        // macOS navigation: Ctrl + J/K
        if (e.ctrlKey && !e.metaKey && !e.altKey && key === 'j') {
          e.preventDefault();
          document.activeElement?.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'ArrowDown',
              code: 'ArrowDown',
              bubbles: true,
            }),
          );
          return;
        }
        if (e.ctrlKey && !e.metaKey && !e.altKey && key === 'k') {
          e.preventDefault();
          document.activeElement?.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'ArrowUp',
              code: 'ArrowUp',
              bubbles: true,
            }),
          );
          return;
        }
      } else {
        if (e.ctrlKey && e.shiftKey && !e.metaKey && !e.altKey && key === 'j') {
          e.preventDefault();
          document.activeElement?.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'ArrowDown',
              code: 'ArrowDown',
              bubbles: true,
            }),
          );
          return;
        }
        if (e.ctrlKey && e.shiftKey && !e.metaKey && !e.altKey && key === 'k') {
          e.preventDefault();
          document.activeElement?.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'ArrowUp',
              code: 'ArrowUp',
              bubbles: true,
            }),
          );
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={setOpen}
      className={styles.overlay}
      isDismissable
    >
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
                <Button
                  onPress={closePalette}
                  className={styles.escButton}
                  aria-label="Close command palette"
                >
                  Esc
                </Button>
              </div>
              <Menu
                items={commands}
                className={styles.menu}
                onAction={handleCommandSelect}
              >
                {(section) => (
                  <MenuSection id={section.name}>
                    <Header className={styles.menuHeader}>
                      {section.name}
                    </Header>
                    <Collection items={section.items}>
                      {(item) => (
                        <CommandItem id={item.id} textValue={item.label}>
                          {({ isFocused }) => (
                            <div className={styles.itemRow}>
                              <div
                                className={
                                  item.id === 'logout'
                                    ? styles.logOut
                                    : styles.itemLeft
                                }
                              >
                                {item.icon && <span>{item.icon}</span>}
                                <span>{item.label}</span>
                              </div>
                              {isFocused && (
                                <Icon
                                  iconNode={<CornerDownRight />}
                                  size={16}
                                  style={{
                                    transform: 'scaleX(-1)',
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </CommandItem>
                      )}
                    </Collection>
                  </MenuSection>
                )}
              </Menu>
            </Autocomplete>
            <div className={styles.bottomContainer}>
              {isMac ? (
                <>
                  <Icon iconNode={<ArrowDown />} size={12} />
                  <span className={styles.textBox}>Ctrl + J</span>
                  <span>|</span>
                  <Icon iconNode={<ArrowUp />} size={12} />
                  <span className={styles.textBox}>Ctrl + K</span>
                </>
              ) : (
                <>
                  <Icon iconNode={<ArrowDown />} size={12} />
                  <span className={styles.textBox}>Ctrl + Shift + J</span>
                  <span>|</span>
                  <Icon iconNode={<ArrowUp />} size={12} />
                  <span className={styles.textBox}>Ctrl + Shift + K</span>
                </>
              )}
            </div>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default CommandPalette;
