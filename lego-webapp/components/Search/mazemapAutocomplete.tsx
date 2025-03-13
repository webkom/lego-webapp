import { debounce } from 'lodash';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { mazemapScript } from '~/components/MazemapEmbed';
import { useWaitForGlobal } from '~/utils/useWaitForGlobal';
import { stripHtmlTags } from './utils';
import type { ComponentType } from 'react';
import '@webkom/mazemap/css';

type InjectedProps = {
  options: SelectOption[];
  onSearch: (query: string) => void;
  fetching: boolean;
};

type SelectOption = {
  label: string;
  value: number;
};

const mapRoomAndBuildingToSelectOption = (
  value: number,
  poiName: string,
  buildingName: string,
): SelectOption => {
  return {
    label: [poiName, buildingName].filter(Boolean).join(', '),
    value: value,
  };
};

export const useMazemapAutocomplete = () => {
  const Mazemap = useWaitForGlobal('Mazemap');
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [fetching, setFetching] = useState(false);
  const mazemapSearchController = useMemo(() => {
    const SearchController = Mazemap?.Search?.SearchController;
    if (!SearchController) return null;
    return new SearchController({
      campusid: 1,
      rows: 10,
      withpois: true,
      withbuilding: false,
      withtype: false,
      withcampus: false,
      resultsFormat: 'geojson',
    });
  }, [Mazemap]);

  const onSearch = (query: string) => {
    if (!query) {
      return;
    }

    setFetching(true);

    mazemapSearchController &&
      mazemapSearchController
        .search(query)
        .then((results) => {
          setOptions(
            results.results.features.map((result) =>
              mapRoomAndBuildingToSelectOption(
                result.properties.poiId,
                result.properties.dispPoiNames[0],
                result.properties.dispBldNames[0],
              ),
            ),
          );
        })
        .catch(() => {})
        .finally(() => setFetching(false));
  };

  const debouncedOnSearch = debounce(onSearch, 100);

  return { options, onSearch: debouncedOnSearch, fetching };
};

const withMazemapAutocomplete = <P,>({
  WrappedComponent,
}: {
  WrappedComponent: ComponentType<P & InjectedProps>;
}) => {
  const Component = (props: P) => {
    const { options, onSearch, fetching } = useMazemapAutocomplete();

    return (
      <>
        <Helmet title="Mazemap Search">{mazemapScript}</Helmet>
        <WrappedComponent
          {...props}
          options={options}
          onSearch={onSearch}
          fetching={fetching}
        />
      </>
    );
  };
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
  Component.displayName = `MazemapAutocomplete(${displayName})`;

  return Component;
};

export default withMazemapAutocomplete;
