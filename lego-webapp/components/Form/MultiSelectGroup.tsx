import { Children, cloneElement, useId } from 'react';
import { FormSpy } from 'react-final-form';
import { FieldSet } from '~/components/Form/FieldSet';
import { RenderErrorMessage, toErrorMessages } from './Field';
import styles from './MultiSelectGroup.module.css';
import type { ReactElement } from 'react';

type Props = {
  name: string;
  legend: string;
  description?: string;
  required?: boolean;
  children: ReactElement | ReactElement[];
};

const MultiSelectGroup = ({
  name,
  legend,
  description,
  required,
  children,
}: Props) => {
  const errorId = `${useId()}-error`;

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
              required={required}
              aria-invalid={hasError || undefined}
              aria-describedby={hasError ? errorId : undefined}
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
              />
            )}
          </div>
        );
      }}
    </FormSpy>
  );
};

export default MultiSelectGroup;
