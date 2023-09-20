import { Field, type FieldRenderProps } from 'react-final-form';

type Props = {
  names: string[];
  subscription?: object;
  fieldsState?: Record<string, FieldRenderProps<unknown, HTMLElement>>;
  children?: (
    fieldsState: Record<string, FieldRenderProps<unknown, HTMLElement>>
  ) => React.ReactNode;
  originalRender?: (
    fieldsState: Record<string, FieldRenderProps<unknown, HTMLElement>>
  ) => React.ReactNode;
};

/**
 * Equivalent to redux-form's Fields component
 */
const Fields = ({
  names,
  subscription,
  fieldsState = {},
  children,
  originalRender,
}: Props) => {
  if (!names.length) {
    const renderFunction = originalRender || children;
    if (typeof renderFunction === 'function') {
      return renderFunction(fieldsState) as JSX.Element;
    }
  }

  const [name, ...rest] = names;

  return (
    <Field name={name} subscription={subscription}>
      {(fieldState) => (
        <Fields
          names={rest}
          subscription={subscription}
          originalRender={originalRender || children}
          fieldsState={{ ...fieldsState, [name]: fieldState }}
        >
          {children}
        </Fields>
      )}
    </Field>
  );
};

export default Fields;
