import cx from 'classnames';
import { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Field } from 'redux-form';
import { addPenalty } from 'app/actions/UserActions';
import Button from 'app/components/Button';
import {
  legoForm,
  Form,
  TextArea,
  TextInput,
  SelectInput,
  withSubmissionError,
} from 'app/components/Form';
import type { AddPenalty, ID } from 'app/models';
import type { FormEventHandler } from 'react';

type Props = {
  user: ID;
  addPenalty: (arg0: AddPenalty) => Promise<void>;
  reason?: string;
  weight?: number;
  handleSubmit: (arg0: (...args: Array<any>) => any) => FormEventHandler;
  actionGrant: boolean;
  hidden?: boolean;
  button?: boolean;
  className?: string;
  reset: () => void;
};
type State = {
  hidden: boolean;
  sent: boolean;
};

class PenaltyInLine extends Component<Props, State> {
  state = {
    hidden: true,
    sent: false,
  };
  onSubmit = (penalty, user) =>
    this.props
      .addPenalty({
        ...penalty,
        sourceEvent: penalty.sourceEvent && penalty.sourceEvent.value,
        user,
      })
      .then(() => {
        this.setState(() => ({
          sent: true,
        }));
        this.props.reset();
      });
  handleHide = () => {
    this.setState((prevState) => ({
      hidden: !prevState.hidden,
    }));
  };

  render() {
    const { actionGrant, handleSubmit, user, button, className } = this.props;
    const showButton = button && this.state.hidden && !this.state.sent;
    const showLabel = !button || !this.state.hidden || this.state.sent;
    const showForm = !this.state.hidden && !this.state.sent;
    return (
      <div>
        {actionGrant && (
          <div>
            {showButton && (
              <Button onClick={this.handleHide}>Ny kunngjøring</Button>
            )}
            {showLabel && (
              <div>
                {!this.state.sent ? (
                  <Button onClick={this.handleHide} className={cx(className)}>
                    Lag ny prikk
                  </Button>
                ) : (
                  <i>Prikken er registrert</i>
                )}
              </div>
            )}

            {showForm && (
              <Form
                onSubmit={handleSubmit(
                  withSubmissionError((values) => this.onSubmit(values, user))
                )}
              >
                <Field
                  name="reason"
                  component={TextArea.Field}
                  placeholder="Skriv din begrunnelse for prikk..."
                />
                <Field
                  name="weight"
                  component={TextInput.Field}
                  placeholder="Hvor tungt vektlegges prikken?"
                />
                <Field
                  name="sourceEvent"
                  placeholder="Arrangement"
                  filter={['events.event']}
                  component={SelectInput.AutocompleteField}
                />
                <Button submit>Lag prikk</Button>
              </Form>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  actionGrant: state.allowed.penalties,
});

const mapDispatchToProps = {
  addPenalty,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  legoForm({
    form: 'penaltyInline',

    validate(values) {
      const errors = {};

      if (!values.message) {
        errors.message = 'Du må skrive en melding';
      }

      return errors;
    },
  })
)(PenaltyInLine);
