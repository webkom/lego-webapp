import cx from 'classnames';
import { Children, cloneElement, useId } from 'react';
import { FormSpy } from 'react-final-form';
import { FieldSet } from '~/components/Form/FieldSet';
import { RenderErrorMessage, toErrorMessages } from './Field';
import styles from './MultiSelectGroup.module.css';
import type { DescriptionPosition } from './Label';
import type { ReactElement } from 'react';

type Props = {
  name: string;
  legend: string;
  description?: string;
  descriptionPosition?: DescriptionPosition;
  required?: boolean;
  children: ReactElement | ReactElement[];
};

const MultiSelectGroup = ({
  name,
  legend,
  description,
  descriptionPosition,
  required,
  children,
}: Props) => {
  const groupId = useId();
  const errorId = `${groupId}-error`;
  const descriptionId = `${groupId}-description`;

  return (
    <FormSpy subscription={{ errors: true, submitErrors: true, touched: true }}>
      {(props) => {
        const messages = [
          ...toErrorMessages(props.errors?.[name]),
          ...toErrorMessages(props.submitErrors?.[name]),
        ];
        const hasError = !!props.touched?.[name] && messages.length > 0;

        return (
          <div className={styles.multiSelectGroup}>
            <FieldSet
              legend={legend}
              description={description}
              descriptionId={descriptionId}
              descriptionPosition={descriptionPosition}
              required={required}
              aria-invalid={hasError || undefined}
              aria-describedby={
                cx(description && descriptionId, hasError && errorId) ||
                undefined
              }
              aria-required={required || undefined}
            >
              <div className={styles.group}>
                {Children.map(children, (child) =>
                  cloneElement(child, {
                    name,
                  }),
                )}
              </div>
            </FieldSet>
            {hasError && (
              <RenderErrorMessage
                id={errorId}
                error={messages}
                fieldName={name}
                variant="text"
              />
            )}
          </div>
        );
      }}
    </FormSpy>
  );
};

export default MultiSelectGroup;
