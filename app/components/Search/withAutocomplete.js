import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autocomplete } from 'app/actions/SearchActions';
import { debounce } from 'lodash';

function withAutocomplete(WrappedComponent) {
  return class extends Component {
    state = {
      searching: false,
      result: []
    };

    handleSearch = (query, filter) => {
      this.setState({
        searching: true
      });
      this.props
        .autocomplete(query, filter)
        .then(result =>
          this.setState({
            result,
            searching: false
          })
        )
        .catch(() => this.setState({ searching: false }));
    };

    render() {
      const { filter, ...restProps } = this.props;
      return (
        <WrappedComponent
          {...restProps}
          options={this.state.result}
          onSearch={debounce(query => this.handleSearch(query, filter), 300)}
          fetching={this.state.searching}
        />
      );
    }
  };
}

const mapDispatchToProps = dispatch => ({
  autocomplete: (query, filter) => dispatch(autocomplete(query, filter))
});

export default WrappedComponent =>
  connect(null, mapDispatchToProps)(withAutocomplete(WrappedComponent));
