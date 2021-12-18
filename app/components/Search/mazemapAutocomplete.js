// @flow

import React, { Component, type ComponentType } from 'react';
import { debounce } from 'lodash';
import * as Mazemap from './mazemap.min.js';
import { stripHtmlTags } from './utils.js';


type InjectedProps = {
  mazemapSearch: (query: string) => Promise<*>
};

type State = {
  searching: boolean,
  result: Array</*Todo: AutocompleteResult */ Object>
};

const test = async (mazemapPoi): string => {
  Mazemap.Data.getPoi(mazemapPoi).then(poi => {return stripHtmlTags(poi.properties.title + ", " + poi.properties.buildingName)})
}

function mazemapAutocomplete<Props>({
  WrappedComponent,
}: {
  WrappedComponent: ComponentType<Props>,
}) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
  
  const mySearch = new Mazemap.Search.SearchController({
    campusid: 1,
    rows: 10,
    withpois: true,
    withbuilding: false,
    withtype: false,
    withcampus: false,
    resultsFormat: 'geojson'
  })

  return class extends Component<InjectedProps & Props, State> {
    static displayName = `Autocomplete(${displayName})`;

    state = {
      searching: false,
      result: [{
        label: this.props.input.value,
        value: this.props.input.value,
      }]
    };

    _isMounted = false;

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    handleSearch = (query: string): void => {
      if (!query) {
        return;
      }
      this.setState({
        searching: true
      });

      mySearch.search(query)
        .then(results => {
          if (this._isMounted) {
            this.setState({
              result: results.results.features.map(result => ({
                label: stripHtmlTags(result.properties.dispPoiNames[0] + ", " + result.properties.dispBldNames[0]),
                value: result.properties.poiId,
              })),
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
      return (
        // $FlowFixMe
        <WrappedComponent
          {...this.props}
          options={this.state.result}
          onSearch={debounce(query => this.handleSearch(query), 300)}
          fetching={this.state.searching}
        />
      );
    }
  };
}

export default mazemapAutocomplete;