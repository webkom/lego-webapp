import { Icon } from '@webkom/lego-bricks';
import { ArrowDown, ArrowUp, CornerDownRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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
  Button,
  useFilter,
  Key,
} from 'react-aria-components';
import {
  fetchCommandSuggestions,
  recordCommandUsage,
} from '~/redux/actions/UserActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectCommandSuggestions } from '~/redux/slices/users';
import styles from './CommandPalette.module.css';
import createCommands from './commands';

const CommandItem = (props: React.ComponentProps<typeof MenuItem>) => (
  <MenuItem {...props} className={styles.menuItem} />
);

const CommandPalette = () => {
  const isServer = typeof window === 'undefined';

  const [isOpen, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const { contains } = useFilter({ sensitivity: 'base' });
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const suggestionIds = useAppSelector(selectCommandSuggestions);

  useEffect(() => {
    if (isServer) return;
    setIsMac(/mac(os|intosh)/i.test(navigator.userAgent));
  }, [isServer]);

  useEffect(() => {
    if (isServer) return;
    if (currentUser) dispatch(fetchCommandSuggestions());
  }, [isServer, currentUser, dispatch]);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchCommandSuggestions());
    }
  }, [currentUser, dispatch]);

  const commands = createCommands(dispatch, suggestionIds);
  const allItems = commands.flatMap((s) => s.items);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (isMac ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        togglePalette();
      }

      if (isOpen) {
        if (e.ctrlKey && e.key.toLowerCase() === 'j') {
          e.preventDefault();
          const downEvent = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            bubbles: true,
          });
          document.activeElement?.dispatchEvent(downEvent);
          return;
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          const upEvent = new KeyboardEvent('keydown', {
            key: 'ArrowUp',
            code: 'ArrowUp',
            bubbles: true,
          });
          document.activeElement?.dispatchEvent(upEvent);
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  if (isServer) return null;

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
                <p>
                  <Icon iconNode={<ArrowDown />} size={12} />
                  Ctrl + J
                </p>
                <p>|</p>
                <p>
                  <Icon iconNode={<ArrowUp />} size={12} />
                  Ctrl + K
                </p>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
};

export default CommandPalette;
