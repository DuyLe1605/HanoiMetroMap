'use client';

import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useMetroStore } from '@/store/useMetroStore';
import { getStationsByLine } from '@/data/stations';
import { gpsTo3D } from '@/utils/coordinates';

export default function CameraController() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 45, 25));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  
  const cameraMode = useMetroStore(s => s.cameraMode);
  const selectedLineId = useMetroStore(s => s.selectedLineId);
  const isRiding = useMetroStore(s => s.isRiding);
  const rideLineId = useMetroStore(s => s.rideLineId);
  const rideProgress = useMetroStore(s => s.rideProgress);

  // Ride curve
  const rideCurve = useMemo(() => {
    if (!rideLineId) return null;
    const stations = getStationsByLine(rideLineId);
    const points = stations.map(s => {
      const [x, , z] = gpsTo3D(s.lat, s.lng);
      return new THREE.Vector3(x, 0.5, z);
    });
    return points.length >= 2
      ? new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
      : null;
  }, [rideLineId]);

  // Compute target camera position based on mode
  useEffect(() => {
    if (cameraMode === 'overview') {
      targetPos.current.set(5, 50, 30);
      targetLookAt.current.set(5, 0, -5);
    } else if (cameraMode === 'line-focus' && selectedLineId) {
      const stations = getStationsByLine(selectedLineId);
      if (stations.length > 0) {
        // Center on the middle station
        const midStation = stations[Math.floor(stations.length / 2)];
        const [mx, , mz] = gpsTo3D(midStation.lat, midStation.lng);
        targetPos.current.set(mx + 5, 30, mz + 20);
        targetLookAt.current.set(mx, 0, mz);
      }
    }
  }, [cameraMode, selectedLineId]);

  useFrame(() => {
    if (cameraMode === 'riding' && isRiding && rideCurve) {
      // Follow train
      const trainPoint = rideCurve.getPointAt(Math.min(rideProgress, 0.999));
      const tangent = rideCurve.getTangentAt(Math.min(rideProgress, 0.999));

      // Camera behind and above the train
      const camOffset = tangent.clone().multiplyScalar(-8);
      camOffset.y = 12;
      const camTarget = trainPoint.clone().add(camOffset);

      camera.position.lerp(camTarget, 0.05);
      const lookTarget = trainPoint.clone();
      lookTarget.y = 0.5;

      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(10).add(camera.position);
      currentLookAt.lerp(lookTarget, 0.05);
      camera.lookAt(lookTarget);
    } else {
      // Smooth transition to target
      camera.position.lerp(targetPos.current, 0.03);
      
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.multiplyScalar(10).add(camera.position);
      currentLookAt.lerp(targetLookAt.current, 0.03);
      camera.lookAt(targetLookAt.current);
    }
  });

  return null;
}
