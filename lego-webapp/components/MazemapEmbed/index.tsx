import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import '@webkom/mazemap/css';
import { Helmet } from 'react-helmet-async';
import { Keyboard } from '~/utils/constants';
import { useWaitForGlobal } from '~/utils/useWaitForGlobal';
import styles from './MazemapEmbed.module.css';

type Props = {
  mazemapPoi: number;
  height?: number;
  className?: string;
  linkText?: string;
};

/** A component that shows a mazemap map of a given poi (e.g. room),
 * largely based on https://api.mazemap.com/js/v2.0.63/docs/#ex-data-poi
 *
 * REQUIRED: {mazemapScript} must be included in the pages <Helmet> component
 */
export const MazemapEmbed = ({ mazemapPoi, ...props }: Props) => {
  const isMac = !import.meta.env.SSR && navigator.platform.indexOf('Mac') === 0;
  const Mazemap = useWaitForGlobal('Mazemap');
  const [blockScrollZoom, setBlockScrollZoom] = useState<boolean>(false);
  const [blockTouchMovement, setBlockTouchZoom] = useState<boolean>(false);
  //initialize map only once, mazemapPoi will probably not change
  useEffect(() => {
    if (!Mazemap) return;
    const embeddedMazemap = new Mazemap.Map({
      container: 'mazemap-embed',
      campuses: 1,
      center: {
        lng: 10.4042965,
        lat: 63.4154135,
      },
      zLevel: 3,
      zoom: 16,
      minZoom: 10,
      maxZoom: 20,
      zLevelControl: true,
      scrollZoom: false,
      doubleClickZoom: false,
      dragRotate: false,
      dragPan: false,
      touchZoomRotate: false,
      touchPitch: false,
      //this is a horrible feature
      pitchWithRotate: false,
    });

    embeddedMazemap.dragPan._mousePan.enable();

    let zoomButtonPressed = false;

    const onKeyDown = (e) => {
      if (isMac ? e.key === Keyboard.META : e.key === Keyboard.CONTROL) {
        zoomButtonPressed = true;
      }
    };

    const onKeyUp = (e) => {
      if (isMac ? e.key === Keyboard.META : e.key === Keyboard.CONTROL) {
        zoomButtonPressed = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    let blockScrollZoomTimeout: NodeJS.Timeout;
    embeddedMazemap.on('wheel', () => {
      if (zoomButtonPressed) {
        embeddedMazemap.scrollZoom.enable();
      } else {
        embeddedMazemap.scrollZoom.disable();
        setBlockScrollZoom(true);

        if (blockScrollZoomTimeout) {
          clearTimeout(blockScrollZoomTimeout);
        }

        blockScrollZoomTimeout = setTimeout(() => {
          setBlockScrollZoom(false);
        }, 500);
      }
    });
    embeddedMazemap.on('touchmove', (e) => {
      if (e.points.length < 2) {
        embeddedMazemap.touchZoomRotate.disable();
        embeddedMazemap.dragPan.disable();
        setTimeout(() => {
          setBlockTouchZoom(true);
        }, 100);
      } else {
        setBlockTouchZoom(false);
        embeddedMazemap.touchZoomRotate.enable();
        embeddedMazemap.dragPan.enable();
      }

      e.preventDefault();
    });
    embeddedMazemap.on('touchend', () => {
      setTimeout(() => {
        setBlockTouchZoom(false);
      }, 150);
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

        embeddedMazemap.jumpTo({
          center: lngLat,
          zoom: 18,
        });
        embeddedMazemap.zLevel = poi.properties.zLevel;
      };

      const height = embeddedMazemap.getCanvas().clientHeight;
      const maxHeight = height - 50; // 50 pixels account for margins and spacing

      embeddedMazemap.zLevelControl.setMaxHeight(maxHeight);
    });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [Mazemap, mazemapPoi, isMac]);

  //Allocate height for map and link before map is loaded
  if (!Mazemap) {
    return (
      <>
        <div
          style={{
            height: props.height || 400,
          }}
        />
      </>
    );
  }

  return (
    <Flex column gap="var(--spacing-sm)">
      <Helmet
        title="Mazemap"
        script={[
          {
            type: 'text/javascript',
            src: 'https://api.mazemap.com/js/v2.2.1/mazemap.min.js',
          },
        ]}
      />
      <div
        style={{
          height: props.height || 400,
          opacity: blockScrollZoom || blockTouchMovement ? 0.5 : 1,
          touchAction: 'pan-x pan-y',
        }}
        id="mazemap-embed"
        className={cx(styles.mazemapEmbed, props.className)}
      >
        {(blockScrollZoom || blockTouchMovement) && (
          <span className={styles.blockingText}>
            {blockScrollZoom
              ? `Hold ${isMac ? '⌘' : 'ctrl'} for å zoome`
              : 'Bruk to fingre for å flytte kartet'}
          </span>
        )}
      </div>
    </Flex>
  );
};

export const mazemapScript = (
  <script
    defer
    type="text/javascript"
    src="https://api.mazemap.com/js/v2.2.1/mazemap.min.js"
  />
);
