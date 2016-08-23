import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { editCompany, fetch } from '../../actions/BdbActions';
import EditCompany from './components/EditCompany';

function validateCompany(data) {
  const errors = {};
  if (!data.name) {
    errors.name = 'Vennligst fyll ut dette feltet';
  }

  if (!data.studentContact) {
    errors.studentContact = 'Vennligst fyll ut dette feltet';
  }

  return errors;
}

function mapStateToProps(state, props) {
  const companyId = props.params.companyId;
  const company = state.companies.items
    .map((id) => state.entities.companies[id])[0];

  return {
    company,
    companyId,
    initialValues: company ? {
      name: company.name,
      studentContact: company.studentContact,
      adminComment: company.adminComment,
      jobOfferOnly: company.jobOfferOnly,
      phone: company.phone
    } : {}
  };
}

const mapDispatchToProps = { editCompany, fetch };

class EditCompanyContainer extends Component {
  static propTypes = {
    fetch: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetch(this.props.companyId);
  }

  render() {
    return (
      <EditCompany
        {...this.props}
      />
    );
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: 'editCompany',
    fields: ['name', 'studentContact', 'adminComment', 'jobOfferOnly', 'phone'],
    validate: validateCompany
  })
)(EditCompanyContainer);
