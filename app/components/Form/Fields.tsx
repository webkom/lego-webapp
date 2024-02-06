import { Field, type FieldRenderProps } from 'react-final-form';
import type { FormSubscription } from 'final-form';
import type { ComponentType, ReactNode } from 'react';

type Props<Name extends string = string> = {
  names: Name[];
  subscription?: FormSubscription;
  fieldsState?: Record<Name, FieldRenderProps<unknown>>;
  children?: (
    fieldsState: Record<Name, FieldRenderProps<unknown>>
  ) => ReactNode;
  originalRender?: (
    fieldsState: Record<Name, FieldRenderProps<unknown>>
  ) => ReactNode;
  component: ComponentType<Record<Name, FieldRenderProps<unknown>>>;
};

const Fields = ({
  names,
  subscription,
  fieldsState = {},
  children,
  originalRender,
  component,
}: Props): ReactNode => {
  if (!names.length) {
    const RenderFunction = originalRender || children || component;
    return <RenderFunction {...fieldsState} />;
  }

  const [name, ...rest] = names;

  return (
    <Field name={name} subscription={subscription}>
      {(fieldState) => (
        <Fields
          names={rest}
          subscription={subscription}
          fieldsState={{ ...fieldsState, [name]: fieldState }}
          originalRender={originalRender}
          component={component}
        >
          {children}
        </Fields>
      )}
    </Field>
  );
};

export default Fields;
