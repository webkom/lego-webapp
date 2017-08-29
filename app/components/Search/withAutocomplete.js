// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autocomplete } from 'app/actions/SearchActions';
import { debounce } from 'lodash';

type Props = {
  filter: Array<string>
};

function withAutocomplete(WrappedComponent: any) {
  return class extends Component {
    state = {
      searching: false,
      result: [],
      _isMounted: false
    };

    componentDidMount() {
      this.setState({
        _isMounted: true
      });
    }

    componentWillUnmount() {
      this.setState({
        _isMounted: false
      });
    }

    handleSearch = (query: string, filter): void => {
      this.setState({
        searching: true
      });
      this.props
        .autocomplete(query, filter)
        .then(result => {
          if (this.state._isMounted) {
            this.setState({
              result,
              searching: false
            });
          }
        })
        .catch(() => {
          if (this.state._isMounted) {
            this.setState({ searching: false });
          }
        });
    };

    render() {
      const { filter, ...restProps }: Props = this.props;
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

const mapDispatchToProps = {
  autocomplete
};

export default (WrappedComponent: any) =>
  connect(null, mapDispatchToProps)(withAutocomplete(WrappedComponent));
