import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { editCompany, fetch } from '../../actions/CompanyActions';
import EditCompany from './components/EditCompany';

type Props = {
  fetch: () => {}
};

class EditCompanyRoute extends Component {

  props: Props;

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
    .map((id) => state.companies.byId[id])[0];

  return {
    company,
    companyId,
    initialValues: company ? {
      name: company.name,
      studentContact: company.studentContact,
      adminComment: company.adminComment,
      active: company.active,
      jobOfferOnly: company.jobOfferOnly,
      bedex: company.bedex,
      description: company.description,
      phone: company.phone,
      website: company.website
    } : {}
  };
}

const mapDispatchToProps = { editCompany, fetch };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: 'editCompany',
    /*
    fields: ['name', 'studentContact', 'adminComment', 'active', 'jobOfferOnly',
      'bedex', 'description', 'phone', 'website'],*/
    validate: validateCompany
  })
)(EditCompanyRoute);
