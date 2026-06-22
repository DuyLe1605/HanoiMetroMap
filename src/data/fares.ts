// Fare calculation for Hanoi Metro 9-Line Network
// Cash: Base fare 9,000 VND + 1,000 VND per stop
// Card: ~4.5% discount

import { allStations, getStationsByLine } from './stations';
import { gpsDistance } from '@/utils/coordinates';

interface FareResult {
  cashPrice: number;
  cardPrice: number;
  stops: number;
  estimatedMinutes: number;
  fromStation: string;
  toStation: string;
}

const CASH_BASE_FARE = 9000;
const CASH_INCREMENT_PER_STOP = 1000;
const CARD_DISCOUNT = 0.955; // ~4.5% off
const AVG_TIME_PER_STOP = 2.5; // minutes
const AVG_STOP_DWELL = 0.5; // minutes

export function calculateFare(fromId: string, toId: string): FareResult | null {
  if (fromId === toId) return null;

  const fromStation = allStations.find(s => s.id === fromId);
  const toStation = allStations.find(s => s.id === toId);

  if (!fromStation || !toStation) return null;

  let stops = 0;

  if (fromStation.lineId === toStation.lineId) {
    // Both stations on the same line: calculate exact stops
    const lineStations = getStationsByLine(fromStation.lineId);
    const fromIdx = lineStations.findIndex(s => s.id === fromId);
    const toIdx = lineStations.findIndex(s => s.id === toId);
    if (fromIdx !== -1 && toIdx !== -1) {
      stops = Math.abs(fromIdx - toIdx);
    }
  } else {
    // Cross-line transfer: calculate approximate stops based on GPS distance
    const dist = gpsDistance(fromStation.lat, fromStation.lng, toStation.lat, toStation.lng);
    // Assume average station spacing of ~1.1 km
    stops = Math.max(1, Math.round(dist / 1.1));
  }

  // Base fare covers the first segment, each stop adds increment
  let cashPrice = CASH_BASE_FARE + CASH_INCREMENT_PER_STOP * Math.max(0, stops - 1);
  
  // Cap price at a reasonable maximum for metropolitan travel (e.g. 25,000 VND)
  cashPrice = Math.min(25000, Math.round(cashPrice / 1000) * 1000);
  cashPrice = Math.max(9000, cashPrice);

  const cardPrice = Math.round((cashPrice * CARD_DISCOUNT) / 500) * 500;
  const estimatedMinutes = Math.round(stops * AVG_TIME_PER_STOP + (stops - 1) * AVG_STOP_DWELL);

  return {
    cashPrice,
    cardPrice,
    stops,
    estimatedMinutes,
    fromStation: fromId,
    toStation: toId,
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}
