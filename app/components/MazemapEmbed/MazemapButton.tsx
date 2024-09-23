import { Button, Flex } from '@webkom/lego-bricks';
import { useState } from 'react';
import mazemapLogo from 'app/assets/mazemap.svg';
import { MazemapEmbed } from 'app/components/MazemapEmbed/index';
import styles from 'app/routes/events/components/EventDetail/EventDetail.css';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof MazemapEmbed> & {
  defaultOpen?: boolean;
};

export const MazemapButton = ({ defaultOpen = false, ...props }: Props) => {
  const [mapIsOpen, setMapIsOpen] = useState(defaultOpen);

  return (
    <Flex column gap="var(--spacing-xs)">
      <Button
        className={styles.mapButton}
        onPress={() => setMapIsOpen(!mapIsOpen)}
      >
        <img
          className={styles.mazemapImg}
          alt="MazeMap sin logo"
          src={mazemapLogo}
        />
        {mapIsOpen ? 'Skjul kart' : 'Vis kart'}
      </Button>
      {mapIsOpen && <MazemapEmbed {...props} />}
    </Flex>
  );
};
