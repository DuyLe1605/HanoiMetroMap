import { create } from 'zustand';

interface MetroState {
  // Line selection
  selectedLineId: string | null;
  setSelectedLine: (id: string | null) => void;

  // Station hover
  hoveredStationId: string | null;
  setHoveredStation: (id: string | null) => void;

  // Fare calculator
  fromStationId: string | null;
  toStationId: string | null;
  setFromStation: (id: string | null) => void;
  setToStation: (id: string | null) => void;
  clearFareSelection: () => void;

  // Test ride
  isRiding: boolean;
  rideProgress: number;
  rideLineId: string | null;
  rideSpeed: number;
  ridePaused: boolean;
  rideCameraMode: 'first-person' | 'third-person';
  ridePanelHidden: boolean;
  startRide: (lineId: string) => void;
  stopRide: () => void;
  setRideProgress: (progress: number) => void;
  setRideSpeed: (speed: number) => void;
  toggleRidePause: () => void;
  toggleRideCameraMode: () => void;
  toggleRidePanelHidden: () => void;

  // View mode
  is3D: boolean;
  toggle3D: () => void;

  // Display settings
  showStationNames: boolean;
  terrainFlat: boolean;
  toggleStationNames: () => void;
  toggleTerrainFlat: () => void;

  // Info dialog
  showInfoDialog: boolean;
  setShowInfoDialog: (show: boolean) => void;

  // Active tab
  activeTab: 'ride' | 'route' | 'fare' | 'stations' | 'info';
  setActiveTab: (tab: 'ride' | 'route' | 'fare' | 'stations' | 'info') => void;

  // Map style
  mapStyle: 'voyager' | 'dark-matter' | 'satellite' | 'vector';
  setMapStyle: (style: 'voyager' | 'dark-matter' | 'satellite' | 'vector') => void;
}

export const useMetroStore = create<MetroState>((set) => ({
  selectedLineId: null,
  setSelectedLine: (id) => set((state) => ({
    selectedLineId: state.selectedLineId === id ? null : id,
  })),

  hoveredStationId: null,
  setHoveredStation: (id) => set({ hoveredStationId: id }),

  fromStationId: null,
  toStationId: null,
  setFromStation: (id) => set({ fromStationId: id }),
  setToStation: (id) => set({ toStationId: id }),
  clearFareSelection: () => set({ fromStationId: null, toStationId: null }),

  isRiding: false,
  rideProgress: 0,
  rideLineId: null,
  rideSpeed: 1,
  ridePaused: false,
  rideCameraMode: 'third-person',
  ridePanelHidden: false,
  startRide: (lineId) => set({
    isRiding: true, rideProgress: 0, rideLineId: lineId,
    rideSpeed: 1, ridePaused: false, selectedLineId: lineId, rideCameraMode: 'third-person',
    ridePanelHidden: true,
  }),
  stopRide: () => set({
    isRiding: false, rideProgress: 0, rideLineId: null, ridePaused: false, rideCameraMode: 'third-person',
    ridePanelHidden: false,
  }),
  setRideProgress: (progress) => set({ rideProgress: progress }),
  setRideSpeed: (speed) => set({ rideSpeed: speed }),
  toggleRidePause: () => set((s) => ({ ridePaused: !s.ridePaused })),
  toggleRideCameraMode: () => set((s) => ({
    rideCameraMode: s.rideCameraMode === 'third-person' ? 'first-person' : 'third-person',
  })),
  toggleRidePanelHidden: () => set((s) => ({ ridePanelHidden: !s.ridePanelHidden })),

  is3D: true,
  toggle3D: () => set((s) => ({ is3D: !s.is3D })),

  showStationNames: true,
  terrainFlat: false,
  toggleStationNames: () => set((s) => ({ showStationNames: !s.showStationNames })),
  toggleTerrainFlat: () => set((s) => ({ terrainFlat: !s.terrainFlat })),

  showInfoDialog: false,
  setShowInfoDialog: (show) => set({ showInfoDialog: show }),

  activeTab: 'ride',
  setActiveTab: (tab) => set({ activeTab: tab }),

  mapStyle: 'voyager', // Voyager as default for beautiful bright details, matching user feedback
  setMapStyle: (style) => set({ mapStyle: style }),
}));
