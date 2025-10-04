import { Icon } from '@webkom/lego-bricks';
import { CornerDownRight, SlidersHorizontal, LogOut } from 'lucide-react';
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
  Button,
  useFilter,
} from 'react-aria-components';
import {
  fetchCommandSuggestions,
  recordCommandUsage,
} from '~/redux/actions/UserActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectCommandSuggestions } from '~/redux/slices/users';
import styles from './CommandPalette.module.css';
import CommandPaletteSettings from './CommandPaletteSettings';
import createCommands from './commands';

const CommandItem = (props: React.ComponentProps<typeof MenuItem>) => (
  <MenuItem {...props} className={styles.menuItem} />
);

const CommandPalette = () => {
  const [isOpen, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { contains } = useFilter({ sensitivity: 'base' });
  const dispatch = useAppDispatch();

  const suggestionIds = useAppSelector(selectCommandSuggestions);

  useEffect(() => {
    dispatch(fetchCommandSuggestions());
  }, [dispatch]);

  const commands = createCommands(dispatch, suggestionIds);

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
        if (showSettings) {
          setShowSettings(false);
        } else {
          setOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

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
                    type="button"
                    onPress={() => {
                      if (showSettings) {
                        setShowSettings(false);
                      } else {
                        setOpen(false);
                      }
                    }}
                    className={styles.escButton}
                    aria-label="Close command palette"
                  >
                    Esc
                  </Button>
                </div>
                <Menu
                  items={commands}
                  className={styles.menu}
                  onAction={(id) => {
                    const cmd = commands
                      .flatMap((s) => s.items)
                      .find((c) => c.id === id);

                    if (cmd) {
                      dispatch(recordCommandUsage(cmd.id));
                      cmd.action();
                    }
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
                            {({ isFocused }) => (
                              <div className={styles.itemRow}>
                                {item.id === 'logout' ? (
                                  <div className={styles.logOut}>
                                    <Icon iconNode={<LogOut />} size={15} />
                                    {item.label}
                                  </div>
                                ) : (
                                  <div className={styles.itemLeft}>
                                    {item.icon && <span>{item.icon}</span>}
                                    <span>{item.label}</span>
                                  </div>
                                )}

                                {isFocused && (
                                  <Icon
                                    iconNode={<CornerDownRight />}
                                    size={16}
                                    style={{ transform: 'scaleX(-1)' }}
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
                <p>Cmd + K | Ctrl + K</p>
                <Button
                  onPress={() => setShowSettings((prev) => !prev)}
                  className={styles.buttonSettings}
                  aria-label="Open Command Palette Settings"
                >
                  <Icon iconNode={<SlidersHorizontal />} size={15} />
                </Button>
              </div>
              <CommandPaletteSettings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
              />
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
};

export default CommandPalette;
