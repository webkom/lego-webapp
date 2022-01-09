// @flow
import { useEffect } from 'react';
import 'node_modules/mazemap/mazemap.min.css';
import * as Mazemap from 'mazemap';
import MazemapLink from './MazemapLink';

type Props = {
  mazemapPoi: number,
  height?: number,
  linkText?: string,
};

/** A component that shows a mazemap map of a given poi (e.g. room),
 * largely based on https://api.mazemap.com/js/v2.0.12/docs/#ex-data-poi
 */

export const MazemapEmbed = ({ mazemapPoi, ...props }: Props) => {
  //useEffect to initialize only once, mazemapPoi will probably not change
  useEffect(() => {
    const embeddedMazemap = new Mazemap.Map({
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
    embeddedMazemap.on('load', () => {
      // Initialize a Highlighter for POIs
      // Storing the object on the map just makes it easy to access for other things
      embeddedMazemap.highlighter = new Mazemap.Highlighter(embeddedMazemap, {
        showOutline: true,
        showFill: true,
        outlineColor: Mazemap.Util.Colors.MazeColors.MazeRed,
        fillColor: Mazemap.Util.Colors.MazeColors.MazeRed,
      });
      // Fetching via Data API
      Mazemap.Data.getPoi(mazemapPoi).then((poi) => {
        placePoiMarker(poi);
      });

      const placePoiMarker = (poi) => {
        // Get a center point for the POI, because the data can return a polygon instead of just a point sometimes
        const lngLat = Mazemap.Util.getPoiLngLat(poi);

        new Mazemap.MazeMarker({
          color: '#c0392b',
          innerCircle: true,
          innerCircleColor: '#fff',
          size: 34,
          innerCircleScale: 0.5,
          zLevel: poi.properties.zLevel,
        })
          .setLngLat(lngLat)
          .addTo(embeddedMazemap);

        // If we have a polygon, use the default 'highlight' function to draw a marked outline around the POI.
        if (poi.geometry.type === 'Polygon') {
          embeddedMazemap.highlighter.highlight(poi);
        }
        embeddedMazemap.jumpTo({ center: lngLat, zoom: 18 });
        embeddedMazemap.zLevel = poi.properties.zLevel;
      };

      const height = embeddedMazemap.getCanvas().clientHeight;
      const maxHeight = height - 50; // 50 pixels account for margins and spacing
      embeddedMazemap.zLevelControl.setMaxHeight(maxHeight);
    });
  }, [mazemapPoi]);

  return (
    <>
      <div style={{ height: props.height || 400 }} id="mazemap-embed" />
      <MazemapLink mazemapPoi={mazemapPoi} linkText={props.linkText} />
    </>
  );
};
