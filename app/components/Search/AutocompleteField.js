import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { SelectInput } from 'app/components/Form';
import { autocomplete } from 'app/actions/SearchActions';
import { debounce } from 'lodash';

class AutocompleteField extends Component {
  state = {
    result: []
  };

  handleSearch = (query, filter) => {
    this.props.autocomplete(query, filter).then(result => {
      this.setState({
        result
      });
    });
  };

  render() {
    const { name, filter, searching, ...restProps } = this.props;
    return (
      <Field
        {...restProps}
        name={name}
        component={SelectInput.Field}
        options={this.state.result}
        onSearch={debounce(query => this.handleSearch(query, filter), 30)}
        fetching={searching}
      />
    );
  }
}

const mapStateToProps = state => ({
  searching: state.search.searching
});

const mapDispatchToProps = dispatch => ({
  autocomplete: (query, filter) => dispatch(autocomplete(query, filter))
});

export default connect(mapStateToProps, mapDispatchToProps)(AutocompleteField);
