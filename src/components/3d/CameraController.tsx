'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import { useMetroStore } from '@/store/useMetroStore';
import { getStationsByLine } from '@/data/stations';
import { gpsTo3D } from '@/utils/coordinates';

const ELEV_SCALE = 0.6; // Much more exaggerated elevation for visual impact

export function MapOrbitControls() {
  const isRiding = useMetroStore(s => s.isRiding);
  const is3D = useMetroStore(s => s.is3D);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    if (!is3D) {
      // 2D top-down: lock polar, LEFT mouse = PAN
      controlsRef.current.minPolarAngle = 0;
      controlsRef.current.maxPolarAngle = 0.01;
      controlsRef.current.setPolarAngle(0);
      controlsRef.current.enableRotate = false;
      controlsRef.current.enablePan = true;
      controlsRef.current.screenSpacePanning = true;
      // CRITICAL: remap LEFT mouse to PAN in 2D
      controlsRef.current.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
    } else {
      controlsRef.current.minPolarAngle = 0.2;
      controlsRef.current.maxPolarAngle = Math.PI / 2.1;
      controlsRef.current.enableRotate = true;
      controlsRef.current.enablePan = true;
      controlsRef.current.screenSpacePanning = false;
      controlsRef.current.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      };
    }
  }, [is3D]);

  if (isRiding) return null;

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={is3D}
      maxPolarAngle={is3D ? Math.PI / 2.1 : 0.01}
      minPolarAngle={is3D ? 0.2 : 0}
      minDistance={3}
      maxDistance={120}
      zoomSpeed={0.8}
      panSpeed={0.6}
      rotateSpeed={0.5}
      enableDamping
      dampingFactor={0.08}
      target={[5, 0, -5]}
      mouseButtons={is3D ? {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      } : {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  );
}

export default function CameraController() {
  const { camera } = useThree();
  const isRiding = useMetroStore(s => s.isRiding);
  const rideLineId = useMetroStore(s => s.rideLineId);
  const rideProgress = useMetroStore(s => s.rideProgress);
  const is3D = useMetroStore(s => s.is3D);

  const rideCurve = useRef<THREE.CatmullRomCurve3 | null>(null);

  // Build ride curve with intermediate points — same as TrainModel
  useEffect(() => {
    if (!rideLineId) { rideCurve.current = null; return; }
    const stations = getStationsByLine(rideLineId);
    const points: THREE.Vector3[] = [];

    for (let i = 0; i < stations.length; i++) {
      const s = stations[i];
      const [x, , z] = gpsTo3D(s.lat, s.lng);
      const y = s.elevation * ELEV_SCALE;
      points.push(new THREE.Vector3(x, y, z));

      if (i < stations.length - 1) {
        const ns = stations[i + 1];
        const [nx, , nz] = gpsTo3D(ns.lat, ns.lng);
        const ny = ns.elevation * ELEV_SCALE;
        const steps = 3;
        for (let j = 1; j <= steps; j++) {
          const t = j / (steps + 1);
          const mx = x + (nx - x) * t;
          const mz = z + (nz - z) * t;
          const my = y + (ny - y) * t + Math.sin(t * Math.PI) * 0.3;
          const perpX = -(nz - z);
          const perpZ = (nx - x);
          const len = Math.sqrt(perpX * perpX + perpZ * perpZ);
          const curveFactor = Math.sin(t * Math.PI) * (0.3 + Math.random() * 0.2) * (i % 2 === 0 ? 1 : -1);
          points.push(new THREE.Vector3(
            mx + (perpX / len) * curveFactor,
            my,
            mz + (perpZ / len) * curveFactor
          ));
        }
      }
    }

    rideCurve.current = points.length >= 2
      ? new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.3)
      : null;
  }, [rideLineId]);

  const smoothPos = useRef(new THREE.Vector3());
  const smoothLook = useRef(new THREE.Vector3());
  const initialized = useRef(false);
  const prevIs3D = useRef(is3D);

  // 2D/3D switch when not riding
  useEffect(() => {
    if (!isRiding && prevIs3D.current !== is3D) {
      if (!is3D) {
        camera.position.set(camera.position.x, 70, camera.position.z);
        camera.lookAt(camera.position.x, 0, camera.position.z);
      }
      prevIs3D.current = is3D;
    }
  }, [is3D, isRiding, camera]);

  useFrame(() => {
    if (!isRiding || !rideCurve.current) {
      initialized.current = false;
      return;
    }

    const t = Math.min(rideProgress, 0.997);
    const trainPoint = rideCurve.current.getPointAt(t);
    const tangent = rideCurve.current.getTangentAt(t);

    // Third-person follow: camera BEHIND and ABOVE the train
    const camPos = trainPoint.clone();
    camPos.x -= tangent.x * 6;  // 6 units behind
    camPos.z -= tangent.z * 6;
    camPos.y += 5;  // 5 units above track

    // Look ahead of the train
    const lookT = Math.min(t + 0.02, 0.999);
    const lookPt = rideCurve.current.getPointAt(lookT);
    lookPt.y += 1;

    if (!initialized.current) {
      smoothPos.current.copy(camPos);
      smoothLook.current.copy(lookPt);
      initialized.current = true;
    }

    smoothPos.current.lerp(camPos, 0.04);
    smoothLook.current.lerp(lookPt, 0.03);

    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothLook.current);
  });

  return null;
}
