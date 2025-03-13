import { Accordion, Flex, Icon } from '@webkom/lego-bricks';
import { ChevronRight } from 'lucide-react';
import mazemapLogo from '~/assets/mazemap.svg';
import MazemapLink from '~/components/MazemapEmbed/MazemapLink';
import { MazemapEmbed } from '~/components/MazemapEmbed/index';
import styles from './MazemapAccordion.module.css';
import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof MazemapEmbed> & {
  defaultOpen?: boolean;
};

export const MazemapAccordion = ({ defaultOpen = false, ...props }: Props) => {
  return (
    <>
      <Flex column className={styles.mazemapAccordion}>
        <Accordion
          persistChildren
          defaultOpen={defaultOpen}
          triggerComponent={({ onClick, rotateClassName }) => (
            <Flex
              alignItems="center"
              justifyContent="space-between"
              onClick={onClick}
              className={styles.mazemapAccordionTrigger}
            >
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
            </Flex>
          )}
        >
          <MazemapEmbed {...props} className={styles.mazemapEmbed} />
          <Flex
            alignItems="center"
            justifyContent="center"
            className={styles.mazemapLinkContainer}
          >
            <MazemapLink
              mazemapPoi={props.mazemapPoi}
              linkText={props.linkText}
            />
          </Flex>
        </Accordion>
      </Flex>
    </>
  );
};
