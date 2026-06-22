// Fare calculation for Hanoi Metro
// Line 2A: 9,000 VND (1 stop) → 19,000 VND (11 stops) - cash
// Line 3: 9,000 VND (1 stop) → 15,000 VND (7 stops) - cash (8 operational stations)

interface FareResult {
  cashPrice: number;
  cardPrice: number;
  stops: number;
  estimatedMinutes: number;
  fromStation: string;
  toStation: string;
}

// Line 2A fare calculation
// Base: 9,000 VND for first stop, then ~909 VND per additional stop (cash)
// Card: ~4.5% discount
const LINE_2A_CASH_BASE = 9000;
const LINE_2A_CASH_INCREMENT = 909;
const LINE_2A_CARD_DISCOUNT = 0.955; // ~4.5% off

// Line 3 fare calculation
// Base: 9,000 VND for first stop, then ~857 VND per additional stop (cash)
const LINE_3_CASH_BASE = 9000;
const LINE_3_CASH_INCREMENT = 857;
const LINE_3_CARD_DISCOUNT = 0.955;

// Average time between stations (minutes)
const AVG_TIME_PER_STOP = 2.5;
const AVG_STOP_DWELL = 0.5;

// Station order maps for quick lookup
const line2aOrder: Record<string, number> = {
  'C01': 0, 'C02': 1, 'C03': 2, 'C04': 3, 'C05': 4, 'C06': 5,
  'C07': 6, 'C08': 7, 'C09': 8, 'C10': 9, 'C11': 10, 'C12': 11,
};

const line3Order: Record<string, number> = {
  'S01': 0, 'S02': 1, 'S03': 2, 'S04': 3, 'S05': 4, 'S06': 5,
  'S07': 6, 'S08': 7, 'S09': 8, 'S10': 9, 'S11': 10, 'S12': 11,
};

export function calculateFare(fromId: string, toId: string): FareResult | null {
  // Same station
  if (fromId === toId) return null;

  // Determine which line
  const fromLine2a = fromId in line2aOrder;
  const toLine2a = toId in line2aOrder;
  const fromLine3 = fromId in line3Order;
  const toLine3 = toId in line3Order;

  let stops: number;
  let cashPrice: number;

  if (fromLine2a && toLine2a) {
    // Both on Line 2A
    stops = Math.abs(line2aOrder[fromId] - line2aOrder[toId]);
    cashPrice = Math.round((LINE_2A_CASH_BASE + LINE_2A_CASH_INCREMENT * (stops - 1)) / 1000) * 1000;
  } else if (fromLine3 && toLine3) {
    // Both on Line 3
    stops = Math.abs(line3Order[fromId] - line3Order[toId]);
    cashPrice = Math.round((LINE_3_CASH_BASE + LINE_3_CASH_INCREMENT * (stops - 1)) / 1000) * 1000;
  } else if ((fromLine2a && toLine3) || (fromLine3 && toLine2a)) {
    // Cross-line via Cát Linh transfer (C01 ↔ S10)
    let stopsLine2a: number;
    let stopsLine3: number;

    if (fromLine2a) {
      stopsLine2a = Math.abs(line2aOrder[fromId] - line2aOrder['C01']);
      stopsLine3 = Math.abs(line3Order['S10'] - line3Order[toId]);
    } else {
      stopsLine3 = Math.abs(line3Order[fromId] - line3Order['S10']);
      stopsLine2a = Math.abs(line2aOrder['C01'] - line2aOrder[toId]);
    }
    stops = stopsLine2a + stopsLine3;
    // Combined fare (simplified: sum of both segments)
    const fare2a = stopsLine2a > 0 
      ? LINE_2A_CASH_BASE + LINE_2A_CASH_INCREMENT * (stopsLine2a - 1)
      : 0;
    const fare3 = stopsLine3 > 0 
      ? LINE_3_CASH_BASE + LINE_3_CASH_INCREMENT * (stopsLine3 - 1)
      : 0;
    cashPrice = Math.round((fare2a + fare3) / 1000) * 1000;
  } else {
    return null;
  }

  // Ensure minimum and maximum
  cashPrice = Math.max(9000, cashPrice);

  const cardPrice = Math.round((cashPrice * LINE_2A_CARD_DISCOUNT) / 5) * 5;
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
