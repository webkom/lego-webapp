import { Accordion, Flex, Icon } from '@webkom/lego-bricks';
import { ChevronRight } from 'lucide-react';
import mazemapLogo from 'app/assets/mazemap.svg';
import MazemapLink from 'app/components/MazemapEmbed/MazemapLink';
import { MazemapEmbed } from 'app/components/MazemapEmbed/index';
import styles from './MazemapAccordion.module.css';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof MazemapEmbed> & {
  defaultOpen?: boolean;
};

export const MazemapAccordion = ({ defaultOpen = false, ...props }: Props) => {
  return (
    <>
      <Flex column gap="var(--spacing-xs)" className={styles.mazemapAccordion}>
        <Accordion
          defaultOpen={defaultOpen}
          triggerComponent={({ onClick, rotateClassName }) => (
            <div onClick={onClick} className={styles.mazemapAccordionTrigger}>
              <Flex alignItems="center" gap="var(--spacing-sm)">
                <img
                  className={styles.mazemapImg}
                  alt="MazeMap sin logo"
                  src={mazemapLogo}
                />
                Kart
              </Flex>
              <Icon
                onPress={onClick}
                iconNode={<ChevronRight />}
                className={rotateClassName}
              />
            </div>
          )}
        >
          <MazemapEmbed {...props} className={styles.mazemapEmbed} />
          <div className={styles.mazemapLinkContainer}>
            <MazemapLink
              mazemapPoi={props.mazemapPoi}
              linkText={props.linkText}
            />
          </div>
        </Accordion>
      </Flex>
    </>
  );
};
