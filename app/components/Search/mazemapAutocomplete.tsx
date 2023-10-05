import { debounce } from 'lodash';
import { Component } from 'react';
import { stripHtmlTags } from './utils';
import type { ComponentType } from 'react';
import 'node_modules/mazemap/mazemap.min.css';

type InjectedProps = {
  mazemapSearch: (query: string) => Promise<any>;
  meta: any;
};
type State = {
  searching: boolean;
  result: Array<Record<string, any>>;
  mazemapSearchController: any;
};

function mazemapAutocomplete<Props>({
  WrappedComponent,
}: {
  WrappedComponent: ComponentType<Props>;
}) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  const mapRoomAndBuildingToResult = (
    poiName: string,
    buildingName: string,
    value: number
  ): Record<string, any> => {
    return {
      label: stripHtmlTags(poiName + ', ' + buildingName),
      value: value,
    };
  };

  return class extends Component<InjectedProps & Props, State> {
    static displayName = `Autocomplete(${displayName})`;
    state = {
      searching: false,
      result: [],
      mazemapSearchController: undefined,
    };
    _isMounted = false;

    componentDidMount() {
      import('mazemap').then((mazemap) => {
        this.setState({
          mazemapSearchController: new mazemap.Search.SearchController({
            campusid: 1,
            rows: 10,
            withpois: true,
            withbuilding: false,
            withtype: false,
            withcampus: false,
            resultsFormat: 'geojson',
          }),
        });
      });
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
        searching: true,
      });

      if (this._isMounted) {
        this.state.mazemapSearchController &&
          this.state.mazemapSearchController
            .search(query)
            .then((results) => {
              this.setState({
                result: results.results.features.map((result) =>
                  mapRoomAndBuildingToResult(
                    result.properties.dispPoiNames[0],
                    result.properties.dispBldNames[0],
                    result.properties.poiId
                  )
                ),
              });
            })
            .catch((error) => {})
            .finally(() =>
              this.setState({
                searching: false,
              })
            );
      }
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          options={this.state.result}
          onSearch={debounce((query) => this.handleSearch(query), 300)}
          fetching={this.state.searching}
        />
      );
    }
  };
}

export default mazemapAutocomplete;
