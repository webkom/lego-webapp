import { Icon } from '@webkom/lego-bricks';
import {
  CornerDownRight,
  SlidersHorizontal,
  Terminal,
  LogOut,
} from 'lucide-react';
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
import { useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();
  const commands = useMemo(() => createCommands(dispatch), [dispatch]);

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
          setShowSettings(false); // let settings animate out
        } else {
          setOpen(false); // then close the palette
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  },);

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
                  className={styles.menu}
                  onAction={(id) => {
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
                            {({ isFocused }) => (
                              <>
                                {isFocused && section.name === 'Navigasjon' && (
                                  <Icon
                                    iconNode={<CornerDownRight />}
                                    size={15}
                                  />
                                )}
                                {isFocused && section.name === 'Kommandoer' && (
                                  <Icon iconNode={<Terminal />} size={15} />
                                )}
                                {item.label !== 'Logg ut' && (
                                  <span>{item.label}</span>
                                )}
                                {item.id === 'logout' && (
                                  <div className={styles.logOut}>
                                    <Icon iconNode={<LogOut />} size={15} />
                                    {item.label}
                                  </div>
                                )}
                              </>
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
