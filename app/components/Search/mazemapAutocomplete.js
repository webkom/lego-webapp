// @flow

import { Component, type ComponentType } from 'react';
import { debounce } from 'lodash';
import { stripHtmlTags } from './utils.js';
import 'node_modules/mazemap/mazemap.min.css';

type InjectedProps = {
  mazemapSearch: (query: string) => Promise<*>,
  meta: any,
};

type State = {
  searching: boolean,
  result: Array<Object>,
  Mazemap: any,
};

function mazemapAutocomplete<Props>({
  WrappedComponent,
}: {
  WrappedComponent: ComponentType<Props>,
}) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  const mapRoomAndBuildingToResult = (
    poiName: string,
    buildingName: string,
    value: Number
  ): Object => {
    return {
      label: stripHtmlTags(poiName + ', ' + buildingName),
      value: value,
    };
  };

  return class extends Component<InjectedProps & Props, State> {
    static displayName = `Autocomplete(${displayName})`;

    state = {
      searching: false,
      result: [], //first result fetched on mount
      Mazemap: undefined,
    };

    _isMounted = false;

    componentDidMount() {
      import('mazemap').then((mazemap) => this.setState({ Mazemap: mazemap }));
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    render() {
      const { Mazemap } = this.state;
      const handleSearch = (query: string): void => {
        if (!query || !Mazemap) {
          return;
        }
        const mazemapSearchController = new Mazemap.Search.SearchController({
          campusid: 1,
          rows: 10,
          withpois: true,
          withbuilding: false,
          withtype: false,
          withcampus: false,
          resultsFormat: 'geojson',
        });
        this.setState({
          searching: true,
        });
        mazemapSearchController
          .search(query)
          .then((results) => {
            if (this._isMounted) {
              this.setState({
                result: results.results.features.map((result) =>
                  mapRoomAndBuildingToResult(
                    result.properties.dispPoiNames[0],
                    result.properties.dispBldNames[0],
                    result.properties.poiId
                  )
                ),
              });
            }
          })
          .finally(() => {
            if (this._isMounted) {
              this.setState({ searching: false });
            }
          });
      };
      return (
        <WrappedComponent
          {...this.props}
          options={this.state.result}
          onSearch={debounce((query) => handleSearch(query), 300)}
          fetching={this.state.searching}
        />
      );
    }
  };
}

export default mazemapAutocomplete;
