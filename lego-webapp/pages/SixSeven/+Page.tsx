import mpCamera from '@mediapipe/camera_utils';
import mpDrawing from '@mediapipe/drawing_utils';
import mpHands from '@mediapipe/hands';
import { Flex, Image } from '@webkom/lego-bricks';
import React, { useEffect, useRef, useState } from 'react';
import img from '~/assets/interest-group-logos/49d180ecf56132819571bf39d9b7b342522a2ac6d23c1418d3338251bfe469c8.png';
import type { Results } from '@mediapipe/hands';

const { Hands, HAND_CONNECTIONS } = mpHands as any;
const { Camera } = mpCamera as any;
const { drawConnectors, drawLandmarks } = mpDrawing as any;

class HandGestureProcessor {
  leftHistory: number[] = [];
  rightHistory: number[] = [];
  danceMeter: number = 0;
  meterMax: number = 1000;
  danceCooldown: number = 0;

  dist(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  isOpenHand(landmarks: any[]) {
    const wx = landmarks[0].x;
    const wy = landmarks[0].y;

    const isExtended = (tip: number, mcp: number) => {
      const tipDist = this.dist(wx, wy, landmarks[tip].x, landmarks[tip].y);
      const mcpDist = this.dist(wx, wy, landmarks[mcp].x, landmarks[mcp].y);
      return tipDist > mcpDist;
    };

    return (
      isExtended(8, 5) &&
      isExtended(12, 9) &&
      isExtended(16, 13) &&
      isExtended(20, 17)
    );
  }

  process(multiHandLandmarks: any[]) {
    if (!multiHandLandmarks || multiHandLandmarks.length !== 2) {
      this.danceMeter -= 2;
      this.danceMeter = Math.max(0, this.danceMeter);
      return 'IDLE';
    }

    const sortedHands = [...multiHandLandmarks].sort((a, b) => a[9].x - b[9].x);
    const leftHand = sortedHands[0];
    const rightHand = sortedHands[1];

    const leftOpen = this.isOpenHand(leftHand);
    const rightOpen = this.isOpenHand(rightHand);

    this.leftHistory.push(leftHand[9].y);
    this.rightHistory.push(rightHand[9].y);

    if (this.leftHistory.length > 6) this.leftHistory.shift();
    if (this.rightHistory.length > 6) this.rightHistory.shift();

    if (this.leftHistory.length < 6) return 'IDLE';

    if (this.danceCooldown > 0) {
      this.danceCooldown--;
      return 'IDLE';
    }

    const leftDelta =
      this.leftHistory[this.leftHistory.length - 1] - this.leftHistory[0];
    const rightDelta =
      this.rightHistory[this.rightHistory.length - 1] - this.rightHistory[0];
    const motionThreshold = 0.02;

    const leftDownRightUp =
      leftDelta > motionThreshold && rightDelta < -motionThreshold;
    const leftUpRightDown =
      leftDelta < -motionThreshold && rightDelta > motionThreshold;

    if ((leftDownRightUp || leftUpRightDown) && leftOpen && rightOpen) {
      this.danceMeter += 10;
    } else {
      this.danceMeter -= 5;
    }

    this.danceMeter = Math.max(0, Math.min(this.meterMax, this.danceMeter));

    if (this.danceMeter >= this.meterMax) {
      this.danceCooldown = 30;
      this.danceMeter = 0;
      return 'TRIGGERED';
    } else if (this.danceMeter > 15) {
      return 'IN_PROGRESS';
    }

    return 'IDLE';
  }
}

const processor = new HandGestureProcessor();

const SixSeven = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [danceCompleted, setDanceCompleted] = useState(false);
  const [cameraError, setCameraError] = useState(false); // Used if they disable access.

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!videoElement || !canvasElement) return;

    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) return;

    const onResults = (results: Results) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      // Flip horizontally for a mirror effect, looks more normal that way
      canvasCtx.translate(canvasElement.width, 0);
      canvasCtx.scale(-1, 1);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height,
      );

      let statusText = '';
      let statusColor = 'white';

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: '#00FF00',
            lineWidth: 3,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: '#FF0000',
            lineWidth: 2,
            radius: 3,
          });
        }

        const danceState = processor.process(results.multiHandLandmarks);

        if (danceState === 'TRIGGERED') {
          statusText = 'Gratulerer! Som takk får du dette fine egget';
          statusColor = '#00FF00';

          setDanceCompleted(() => true);
        } else if (danceState === 'IN_PROGRESS') {
          statusText = 'Fortsett...';
          statusColor = '#FFA500';
        }
      }

      canvasCtx.restore();

      const barX = 20;
      const barY = 40;
      const barW = 300;
      const barH = 30;

      canvasCtx.fillStyle = '#333333';
      canvasCtx.fillRect(barX, barY, barW, barH);

      const fillWidth = (processor.danceMeter / processor.meterMax) * barW;
      canvasCtx.fillStyle = '#FF00FF';
      canvasCtx.fillRect(barX, barY, fillWidth, barH);

      canvasCtx.strokeStyle = '#FFFFFF';
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeRect(barX, barY, barW, barH);

      canvasCtx.fillStyle = '#FFFFFF';
      canvasCtx.font = '20px Arial';
      canvasCtx.fillText('6-7 Progresjon', barX, barY - 10);

      if (statusText) {
        canvasCtx.fillStyle = statusColor;
        canvasCtx.font = 'bold 30px Arial';
        canvasCtx.fillText(statusText, 20, 110);
      }
    };

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });

    camera.start().catch((error: Error) => {
      console.error('Camera failed to start:', error);
      setCameraError(true);
    });

    return () => {
      camera.stop();
      hands.close();
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'sans-serif',
        marginTop: '20px',
      }}
    >
      {danceCompleted ? (
        <Flex
          column
          gap={30}
          alignItems="center"
          width={'400px'}
          style={{ textAlign: 'center' }}
        >
          <Image src={img} alt="6-7" />
          <h2>
            Gratulerer! Som takk for den fine dansen får du dette fantastiske
            egget!
          </h2>
        </Flex>
      ) : cameraError ? (
        <Flex column gap={20} alignItems="center">
          <h2>Kamera-tilgang mangler :(</h2>
          <p>
            For å skaffe dette egget, trenger vi tilgang til kameraet ditt.
            Vennligst tillat kamerabruk i nettleseren din og oppdater siden.
            Ingenting blir lagret noen plass!
          </p>
        </Flex>
      ) : (
        <div style={{ position: 'relative', width: '1280px', height: '720px' }}>
          <video ref={videoRef} style={{ display: 'none' }} playsInline />
          <canvas
            ref={canvasRef}
            width="1280"
            height="720"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SixSeven;
