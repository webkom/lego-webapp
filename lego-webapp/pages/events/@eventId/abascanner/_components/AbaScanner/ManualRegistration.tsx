import { Button, Flex, Icon, Modal } from '@webkom/lego-bricks';
import { Check, SearchX } from 'lucide-react';
import { useState } from 'react';
import { Drawer } from '~/components/Drawer';
import EmptyState from '~/components/EmptyState';
import { TextInput } from '~/components/Form';
import { ProfilePicture } from '~/components/Image';
import Time from '~/components/Time';
import { Presence } from '~/redux/models/Registration';
import { useIsMobileViewport } from '~/utils/isMobileViewport';
import styles from './ManualRegistration.module.css';
import type { SelectedAdminRegistration } from '~/redux/slices/events';

type Props = {
  registrations: SelectedAdminRegistration[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onRegister: (username: string) => void;
};

const RegistrationRow = ({
  registration,
  onRegister,
}: {
  registration: SelectedAdminRegistration;
  onRegister: (username: string) => void;
}) => {
  const { user } = registration;
  const isPresent = registration.presence === Presence.PRESENT;

  return (
    <Flex alignItems="center" gap="var(--spacing-sm)" className={styles.row}>
      <ProfilePicture user={user} size={40} />
      <Flex column className={styles.person}>
        <span className={styles.name}>{user.fullName}</span>
        <span className={styles.meta}>
          @{user.username}
          {!registration.pool && ' • Venteliste'}
        </span>
      </Flex>
      {isPresent && (
        <Flex
          alignItems="center"
          gap="var(--spacing-xs)"
          className={styles.present}
        >
          <Icon iconNode={<Check />} size={16} />
          {registration.presenceDate ? (
            <Time time={registration.presenceDate} format="HH:mm" />
          ) : (
            'Møtt'
          )}
        </Flex>
      )}
      {!isPresent && registration.pool && (
        <Button success onPress={() => onRegister(user.username)}>
          Registrer
        </Button>
      )}
    </Flex>
  );
};

const ManualRegistrationContent = ({
  registrations,
  onRegister,
}: Pick<Props, 'registrations' | 'onRegister'>) => {
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();
  const filteredRegistrations = registrations.filter(
    ({ user }) =>
      user.fullName.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query),
  );

  return (
    <Flex column gap="var(--spacing-md)" className={styles.content}>
      <TextInput
        type="text"
        prefix="search"
        placeholder="Brukernavn eller navn"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className={styles.list}>
        {filteredRegistrations.length > 0 ? (
          filteredRegistrations.map((registration) => (
            <RegistrationRow
              key={registration.id}
              registration={registration}
              onRegister={onRegister}
            />
          ))
        ) : (
          <EmptyState iconNode={<SearchX />} body="Ingen påmeldte funnet" />
        )}
      </div>
    </Flex>
  );
};

const ManualRegistration = ({
  registrations,
  isOpen,
  onOpenChange,
  onRegister,
}: Props) => {
  const isMobile = useIsMobileViewport();
  const content = (
    <ManualRegistrationContent
      registrations={registrations}
      onRegister={onRegister}
    />
  );

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} title={'Registrer manuelt'}>
        {content}
      </Drawer>
    );
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} title={'Registrer manuelt'}>
      {content}
    </Modal>
  );
};

export default ManualRegistration;
