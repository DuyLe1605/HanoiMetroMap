import { create } from 'zustand';

interface MetroState {
  // Line selection
  selectedLineId: string | null;
  setSelectedLine: (id: string | null) => void;

  // Station hover
  hoveredStationId: string | null;
  setHoveredStation: (id: string | null) => void;

  // Fare calculator: from/to selection
  fromStationId: string | null;
  toStationId: string | null;
  selectionMode: 'from' | 'to' | null;
  setFromStation: (id: string | null) => void;
  setToStation: (id: string | null) => void;
  setSelectionMode: (mode: 'from' | 'to' | null) => void;
  clearFareSelection: () => void;

  // Test ride
  isRiding: boolean;
  rideProgress: number;
  rideLineId: string | null;
  rideSpeed: number;
  startRide: (lineId: string) => void;
  stopRide: () => void;
  setRideProgress: (progress: number) => void;
  setRideSpeed: (speed: number) => void;

  // Camera
  cameraMode: 'overview' | 'line-focus' | 'riding';
  setCameraMode: (mode: 'overview' | 'line-focus' | 'riding') => void;
}

export const useMetroStore = create<MetroState>((set) => ({
  // Line selection
  selectedLineId: null,
  setSelectedLine: (id) => set((state) => ({
    selectedLineId: state.selectedLineId === id ? null : id,
    cameraMode: state.selectedLineId === id ? 'overview' : (id ? 'line-focus' : 'overview'),
  })),

  // Station hover
  hoveredStationId: null,
  setHoveredStation: (id) => set({ hoveredStationId: id }),

  // Fare calculator
  fromStationId: null,
  toStationId: null,
  selectionMode: null,
  setFromStation: (id) => set({ fromStationId: id, selectionMode: 'to' }),
  setToStation: (id) => set({ toStationId: id, selectionMode: null }),
  setSelectionMode: (mode) => set({ selectionMode: mode }),
  clearFareSelection: () => set({
    fromStationId: null,
    toStationId: null,
    selectionMode: null,
  }),

  // Test ride
  isRiding: false,
  rideProgress: 0,
  rideLineId: null,
  rideSpeed: 1,
  startRide: (lineId) => set({
    isRiding: true,
    rideProgress: 0,
    rideLineId: lineId,
    rideSpeed: 1,
    selectedLineId: lineId,
    cameraMode: 'riding',
  }),
  stopRide: () => set({
    isRiding: false,
    rideProgress: 0,
    rideLineId: null,
    cameraMode: 'overview',
  }),
  setRideProgress: (progress) => set({ rideProgress: progress }),
  setRideSpeed: (speed) => set({ rideSpeed: speed }),

  // Camera
  cameraMode: 'overview',
  setCameraMode: (mode) => set({ cameraMode: mode }),
}));
