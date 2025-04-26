export function getSeatTypeName(seatTypeId: number): string {
  switch (seatTypeId) {
    case 1:
      return "Standard";
    case 2:
      return "Premium";
    case 3:
      return "Recliner";
    case 4:
      return "Accessible";
    case 5:
      return "VIP";
    default:
      return "Unknown";
  }
}

export function getSeatPrice(seatTypeId: number): number {
  switch (seatTypeId) {
    case 1:
      return 8;
    case 2:
      return 12;
    case 3:
      return 14;
    case 4:
      return 8;
    case 5:
      return 20;
    default:
      return 0;
  }
}

export function formatSeatName(row: string, seatNumber: number): string {
  return `${row}${seatNumber}`;
}
