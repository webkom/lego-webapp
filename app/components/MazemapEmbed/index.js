// @flow
import { useEffect, useState } from 'react';
import 'node_modules/mazemap/mazemap.min.css';
import MazemapLink from './MazemapLink';
import { Flex } from '../Layout';

type Props = {
  mazemapPoi: number,
  height?: number,
  linkText?: string,
};

/** A component that shows a mazemap map of a given poi (e.g. room),
 * largely based on https://api.mazemap.com/js/v2.0.63/docs/#ex-data-poi
 */
export const MazemapEmbed = ({ mazemapPoi, ...props }: Props) => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => setHasMounted(true), []);

  //import Mazemap dynamically to prevent ssr issues
  const [Mazemap, setMazemap] = useState(null);
  const [blockScrollZoom, setBlockScrollZoom] = useState<boolean>(false);
  const [blockTouchMovement, setBlockTouchZoom] = useState<boolean>(false);
  let controlPressed = false;

  //initialize map only once, mazemapPoi will probably not change
  useEffect(() => {
    import('mazemap').then((mazemap) => setMazemap(mazemap));
    if (!Mazemap || !hasMounted) return;
    const embeddedMazemap = new Mazemap.Map({
      container: 'mazemap-embed',
      campuses: 1,
      center: { lng: 10.4042965, lat: 63.4154135 },
      zLevel: 3,
      zoom: 16,
      minZoom: 10,
      maxZoom: 20,
      zLevelControl: true,
      scrollZoom: false,
      doubleClickZoom: false,
      dragRotate: false,
      /*dragPan: false,*/
      touchZoomRotate: false,
      touchPitch: false, //this is a horrible feature
      pitchWithRotate: false,
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Control') {
        controlPressed = true;
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Control') {
        controlPressed = false;
        embeddedMazemap.scrollZoom.disable();
      }
    });

    embeddedMazemap.on('wheel', () => {
      controlPressed
        ? embeddedMazemap.scrollZoom.enable()
        : embeddedMazemap.scrollZoom.disable();
      if (!controlPressed) setBlockScrollZoom(true);
      setTimeout(() => {
        setBlockScrollZoom(false);
      }, 500);
    });

    embeddedMazemap.on('mouseout', () => {
      setBlockScrollZoom(false);
    });

    embeddedMazemap.on('touchstart', (e) => {
      if (e.touches.length <= 1) embeddedMazemap.dragPan.disable();
      if (e.touches.length > 1) embeddedMazemap.dragPan.enable();
      z;
    });

    embeddedMazemap.on('touchmove', (e) => {
      //console.log(e.points.length);
      if (e.points.length < 2) {
        setBlockTouchZoom(true);
      } else {
        setBlockTouchZoom(false);
        embeddedMazemap.touchZoomRotate.enable();
      }
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
  }, [Mazemap, hasMounted, mazemapPoi]);

  //Allocate height for map and link before map is loaded
  if (!hasMounted) {
    return (
      <>
        <div style={{ height: props.height || 400 }} />;
        <MazemapLink mazemapPoi={mazemapPoi} linkText={props.linkText} />
      </>
    );
  }
  return (
    <>
      <div
        style={{
          height: props.height || 400,
          opacity: blockScrollZoom || blockTouchMovement ? 0.5 : 1,
        }}
        id="mazemap-embed"
      >
        {(blockScrollZoom || blockTouchMovement) && (
          <span
            style={{
              fontSize: '1.5rem',
              textAlign: 'center',
              color: '#010101',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              transform: 'translate(-50%,-50%)',
              zIndex: 5,
              opacity: (blockScrollZoom || blockTouchMovement) * 1,
            }}
          >
            {blockScrollZoom
              ? 'Hold ctrl for å zoome'
              : 'Bruk to fingre for å flytte kartet'}
          </span>
        )}
      </div>
      <MazemapLink mazemapPoi={mazemapPoi} linkText={props.linkText} />{' '}
    </>
  );
};
