import utilStyles from '~/styles/utilities.module.css';
import styles from './ChristmasCalendar.module.css'
import { Button, Flex, Modal } from '@webkom/lego-bricks';
import { useState } from 'react';
import QuizGame from './QuizGame/QuizGame';

const ChristmasCalendar = () => {
    return (
        <div>
            <h3 className={utilStyles.frontPageHeader}>Julekalender</h3>
            <Flex gap="var(--spacing-sm)">
                <ChristmasCalendarSlot day={1}/>
                <ChristmasCalendarSlot day={2}/>
                <ChristmasCalendarSlot day={3}/>
                <ChristmasCalendarSlot day={4}/>
                <ChristmasCalendarSlot day={5}/>
            </Flex>
        </div>
    )
}

type ChristmasCalendarSlotType = {
    day: number;
    color?: string;
}

const ChristmasCalendarSlot = (props: ChristmasCalendarSlotType) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Button onPress={() => setIsOpen(true)}>Luke {props.day}</Button>
            <Modal
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            title={`Luke ${props.day}`}
            contentClassName={styles.modal}
            >
                <QuizGame index={0}/>
            </Modal>
        </div>
    )
}

export default ChristmasCalendar;