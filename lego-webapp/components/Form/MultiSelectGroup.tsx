import { Children, cloneElement } from 'react';
import { FormSpy } from 'react-final-form';
import { FieldSet } from '~/components/Form/FieldSet';
import { RenderErrorMessage } from './Field';
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
  return (
    <>
      <FieldSet legend={legend} description={description} required={required}>
        <div className={styles.group}>
          {Children.map(children, (child) =>
            cloneElement(child, {
              name,
            }),
          )}
        </div>
      </FieldSet>
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
