import { Children, cloneElement } from 'react';
import { FormSpy } from 'react-final-form';
import { RenderErrorMessage } from './Field';
import styles from './MultiSelectGroup.css';
import type { ReactElement } from 'react';

type Props = {
  name: string;
  label?: string;
  children: ReactElement | ReactElement[];
};

const MultiSelectGroup = ({ name, label, children }: Props) => {
  return (
    <>
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
          let error = '';
          if (Array.isArray(props.errors?.[name])) {
            error = Object.values(props.errors[name][0]).join('');
          } else if (
            props.errors?.[name] &&
            typeof props.errors[name] === 'string'
          ) {
            error = props.errors[name];
          }

          const submitError = props.submitErrors
            ? props.submitErrors[name]
            : '';

          if (props.touched?.[name]) {
            return (
              <>
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
              </>
            );
          }

          return <></>;
        }}
      </FormSpy>
    </>
  );
};

export default MultiSelectGroup;
