// @flow
import { useEffect } from 'react';

type Props = {
  sharepoi: number,
  height?: number,
};

/** A component that shows a mazemap map of a given poi (e.g. room),
 * largely based on https://api.mazemap.com/js/v2.0.12/docs/#ex-data-poi
 */

export const MazemapEmbed = ({ sharepoi, ...props }: Props) => {
  //useEffect to initialize only once, sharepoi will probably not change
  useEffect(() => {
    // $FlowFixMe Mazemap is defined in script tag, has no types
    const myMap = new Mazemap.Map({
      container: 'mazemap-embed',
      campuses: 1,
      center: { lng: 10.4042965, lat: 63.4154135 },
      zLevel: 3,
      zoom: 16,
      minZoom: 10,
      maxZoom: 20,
      zLevelControl: true,
      scrollZoom: true,
      doubleClickZoom: false,
      touchZoomRotate: false,
    });
    myMap.on('load', () => {
      // Initialize a Highlighter for POIs
      // Storing the object on the map just makes it easy to access for other things
      myMap.highlighter = new Mazemap.Highlighter(myMap, {
        showOutline: true, // optional
        showFill: true, // optional
        outlineColor: Mazemap.Util.Colors.MazeColors.MazeBlue, // optional
        fillColor: Mazemap.Util.Colors.MazeColors.MazeBlue, // optional
      });
      // Fetching via Data API
      Mazemap.Data.getPoi(sharepoi).then((poi) => {
        placePoiMarker(poi);
      });

      const placePoiMarker = (poi) => {
        // Get a center point for the POI, because the data can return a polygon instead of just a point sometimes
        const lngLat = Mazemap.Util.getPoiLngLat(poi);

        const mazeMarker = new Mazemap.MazeMarker({
          color: '#ff00cc',
          innerCircle: true,
          innerCircleColor: '#FFF',
          size: 34,
          innerCircleScale: 0.5,
          zLevel: poi.properties.zLevel,
        })
          .setLngLat(lngLat)
          .addTo(myMap);

        // If we have a polygon, use the default 'highlight' function to draw a marked outline around the POI.
        if (poi.geometry.type === 'Polygon') {
          myMap.highlighter.highlight(poi);
        }
        myMap.jumpTo({ center: lngLat, zoom: 18 });
        myMap.zLevel = poi.properties.zLevel;
      };

      const height = myMap.getCanvas().clientHeight;
      const maxHeight = height - 50; // 50 pixels account for margins and spacing
      myMap.zLevelControl.setMaxHeight(maxHeight);
    });
  }, [sharepoi]);

  return (
    <>
      <div style={{ height: props.height || 400 }} id="mazemap-embed" />
      <a
        href={
          'https://use.mazemap.com/#v=1&sharepoitype=poi&campusid=1&sharepoi=' +
          sharepoi
        }
        rel="noreferrer noopener"
        target="_blank"
      >
        Åpne kart i ny fane
      </a>
    </>
  );
};
