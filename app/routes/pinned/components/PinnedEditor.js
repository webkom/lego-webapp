import React, { Component } from 'react';
import moment from 'moment-timezone';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Button from 'app/components/Button';
import { SelectInput, legoForm, DatePicker } from 'app/components/Form';
import { Form, Field } from 'redux-form';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';

class PinnedEditor extends Component {
  render() {
    const handleDeletePinned = () => {
      const { deletePinned, initialValues: { id }, push } = this.props;
      return deletePinned(id).then(() => {
        push('/pinned/');
      });
    };

    const header = this.props.new ? 'Fest oppslag' : 'Rediger oppslag';
    const { handleSubmit, pristine, submitting } = this.props;

    return (
      <Content>
        <NavigationTab title={header}>
          <NavigationLink to="/pinned/">Tilbake</NavigationLink>
        </NavigationTab>
        <Form onSubmit={handleSubmit}>
          <Field
            name="article"
            label="Artikkel"
            filter={['articles.article']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            name="event"
            label="Arrangement"
            filter={['events.event']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            name="targetGroups"
            label="Skal vises for gruppene"
            multi
            filter={['users.abakusgroup']}
            component={SelectInput.AutocompleteField}
          />
          <Field
            label="Festet fra"
            name="pinnedFrom"
            component={DatePicker.Field}
          />
          <Field
            label="Festet til"
            name="pinnedTo"
            component={DatePicker.Field}
          />
          <Button disabled={pristine || submitting} submit>
            {this.props.new ? 'Fest oppslag' : 'Lagre oppslag'}
          </Button>
          {this.props.initialValues.id && (
            <ConfirmModalWithParent
              title="Fjern festet oppslag"
              message="Er du sikker på at du vil fjerne dette oppslaget?"
              onConfirm={handleDeletePinned}
            >
              <Button>Delete</Button>
            </ConfirmModalWithParent>
          )}
        </Form>
      </Content>
    );
  }
}

const onSubmit = (
  { article, event, targetGroups, pinnedFrom, pinnedTo, ...rest },
  dispach,
  props
) => {
  return props.handleSubmitCallback({
    article: article && article.value,
    event: event && event.value,
    targetGroups: targetGroups.map(group => group.value),
    pinnedFrom: moment(pinnedFrom).format('YYYY-MM-DD'),
    pinnedTo: moment(pinnedTo).format('YYYY-MM-DD'),
    ...rest
  });
};

export default legoForm({
  form: 'pinnedEditor',
  onSubmit
})(PinnedEditor);
