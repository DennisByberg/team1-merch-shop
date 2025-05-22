export function mapOrderStatusToString(statusNumber: number): string {
  switch (statusNumber) {
    case 0:
      return 'Pending';
    case 1:
      return 'Processing';
    case 2:
      return 'Shipped';
    case 3:
      return 'Delivered';
    case 4:
      return 'Cancelled';

    default:
      return 'Unknown';
  }
}
