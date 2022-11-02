import type { Node } from 'react';
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import Tooltip from 'app/components/Tooltip';
import Flex from 'app/components/Layout/Flex';
import {
  fieldArrayMetaPropTypes,
  fieldArrayFieldsPropTypes,
  Form,
  Field,
  FieldArray,
} from 'redux-form';
import {
  TextInput,
  SelectInput,
  TextArea,
  legoForm,
  CheckBox,
} from 'app/components/Form';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import styles from './PollEditor.css';
import type { PollEntity } from 'app/reducers/polls';
import 'app/reducers/polls';
import type { ID } from 'app/models';
import 'app/models';
const keyCodes = {
  enter: 13,
  space: 32,
};
type Props = {
  pristine: boolean;
  submitting: boolean;
  editOrCreatePoll: (arg0: PollEntity) => Promise<any>;
  handleSubmit: (arg0: Record<string, any>) => Promise<any>;
  //TODO add reduxForm typing
  editing: boolean;
  initialValues: PollEntity;
  pollId: ID;
  deletePoll: () => Promise<any>;
  toggleEdit: () => void;
};
type FieldArrayPropTypes = {
  fields: fieldArrayFieldsPropTypes;
  meta: fieldArrayMetaPropTypes;
};

const renderOptions = ({
  fields,
  meta: { touched, error },
}: FieldArrayPropTypes): Node => (
  <div>
    <ul className={styles.options}>
      {fields.map((option, i) => (
        <li className={styles.optionField} key={i}>
          <Field
            name={`${option}.name`}
            label={`Valg nr. ${i + 1}`}
            placeholder={`Valg ${i + 1}`}
            component={TextInput.Field}
            required
          />
          <ConfirmModalWithParent
            title="Slett valg"
            message="Er du sikker på at du vil slette dette valget?"
            onConfirm={async () => fields.remove(i)}
            closeOnConfirm
            className={styles.deleteOption}
          >
            <Tooltip content="Fjern">
              <Icon name="trash" className={styles.deleteOption} />
            </Tooltip>
          </ConfirmModalWithParent>
        </li>
      ))}
    </ul>

    <Button onClick={() => fields.push({})}>
      <Icon name="add" size={25} />
      Legg til alternativ
    </Button>
  </div>
);

class EditPollForm extends Component<Props, any> {
  render() {
    const { pristine, submitting, handleSubmit, editing, deletePoll } =
      this.props;
    return (
      <Content>
        <Helmet title={editing ? `Redigerer avstemning` : 'Ny avstemning'} />
        {!editing && (
          <NavigationTab
            title="Ny avstemning"
            back={{
              label: 'Tilbake',
              path: '/polls',
            }}
          />
        )}
        <Form onSubmit={handleSubmit}>
          <Field
            name="title"
            label="Spørsmål"
            placeholder="Hva er din favorittrett?"
            component={TextInput.Field}
            required
          />
          <span />
          <Field
            name="description"
            label="Beskrivelse"
            placeholder="Mer info..."
            component={TextArea.Field}
          />
          <Field
            name="pinned"
            label="Vis på forsiden"
            component={CheckBox.Field}
          />
          <Field
            name="resultsHidden"
            label="Skjul resultatet"
            component={CheckBox.Field}
          />
          <Field
            name="tags"
            label="Tags"
            filter={['tags.tag']}
            placeholder="Skriv inn tags"
            component={SelectInput.AutocompleteField}
            isMulti
            tags
            shouldKeyDownEventCreateNewOption={({
              keyCode,
            }: {
              keyCode: number;
            }) => keyCode === keyCodes.enter || keyCode === keyCodes.space}
          />
          <FieldArray
            name="options"
            component={renderOptions}
            rerenderOnEveryChange={true}
          />
          <Flex className={styles.actionButtons}>
            <Button disabled={pristine || submitting} success={editing} submit>
              {editing ? 'Lagre endringer' : 'Lag ny avstemning'}
            </Button>
            {editing && (
              <ConfirmModalWithParent
                title="Slett avstemning"
                message="Er du sikker på at du vil slette avstemningen?"
                onConfirm={deletePoll}
                closeOnConfirm
              >
                <Button danger>
                  <Icon name="trash" size={19} />
                  Slett avstemning
                </Button>
              </ConfirmModalWithParent>
            )}
          </Flex>
        </Form>
      </Content>
    );
  }
}

const onSubmit = (
  {
    title,
    description,
    tags,
    options,
    pinned,
    resultsHidden,
    ...rest
  }: {
    title: string;
    description: string;
    tags: Array<{
      value: string;
    }>;
    options: Array<{
      id: ID | null | undefined;
      name: string;
    }>;
    resultsHidden: boolean;
    pinned: boolean;
  },
  dispatch,
  props
) =>
  props
    .editOrCreatePoll({
      title,
      description,
      resultsHidden,
      tags: tags ? tags.map((val) => val.value) : [],
      options,
      pinned: pinned ? pinned : false,
      ...(rest as Record<string, any>),
    })
    .then(() => props.toggleEdit());

export default legoForm({
  form: 'createPollForm',
  onSubmit,
  initialValues: {
    options: [{}, {}],
    pinned: false,
  },
})(EditPollForm);
