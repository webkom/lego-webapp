import { Children, cloneElement } from 'react';
import { FormSpy } from 'react-final-form';
import { RenderErrorMessage } from './Field';
import styles from './MultiSelectGroup.css';
import type { ReactElement } from 'react';

type Props = {
  name: string;
  label: string;
  children: ReactElement | ReactElement[];
};

const MultiSelectGroup = ({ name, label, children }: Props) => {
  return (
    <div>
      <label className={styles.groupLabel}>{label}</label>
      <div className={styles.group}>
        {Children.map(children, (child) =>
          cloneElement(child, {
            name,
            fieldClassName: styles.radioField,
            labelClassName: styles.radioLabel,
          }),
        )}
      </div>
      <FormSpy
        subscription={{ errors: true, submitErrors: true, touched: true }}
      >
        {(props) => {
          const error = props.errors ? props.errors[name] : [];
          const submitError = props.submitErrors
            ? props.submitErrors[name]
            : [];
          if (props.touched?.[name]) {
            return (
              <div>
                <RenderErrorMessage
                  key={error}
                  error={error}
                  fieldName={name}
                />
                <RenderErrorMessage
                  key={submitError}
                  error={submitError}
                  fieldName={name}
                />
              </div>
            );
          }

          return <div></div>;
        }}
      </FormSpy>
    </div>
  );
};

export default MultiSelectGroup;
