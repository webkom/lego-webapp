// @flow

import React, { Component, type ComponentType } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { autocomplete } from 'app/actions/SearchActions';
import { debounce } from 'lodash';

type InjectedProps = {
  filter: Array<string>,
  autocomplete: (query: string, filter?: Array<string>) => Promise<*>
};

type State = {
  searching: boolean,
  result: Array</*Todo: AutocompleteResult */ Object>
};

function withAutocomplete<Props: {}>(WrappedComponent: ComponentType<Props>) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  return class extends Component<InjectedProps & Props, State> {
    static displayName = `Autocomplete(${displayName})`;

    state = {
      searching: false,
      result: []
    };

    _isMounted = false;

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    handleSearch = (query: string, filter): void => {
      this.setState({
        searching: true
      });

      this.props
        .autocomplete(query, filter)
        .then(result => {
          if (this._isMounted) {
            this.setState({
              result,
              searching: false
            });
          }
        })
        .catch(() => {
          if (this._isMounted) {
            this.setState({ searching: false });
          }
        });
    };

    render() {
      const { filter, autocomplete, ...restProps } = this.props;
      return (
        // $FlowFixMe
        <WrappedComponent
          {...restProps}
          options={this.state.result}
          onSearch={debounce(query => this.handleSearch(query, filter), 300, {
            leading: true
          })}
          fetching={this.state.searching}
        />
      );
    }
  };
}

const mapDispatchToProps = {
  autocomplete
};

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withAutocomplete
);
