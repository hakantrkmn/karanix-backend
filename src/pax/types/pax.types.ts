export enum PaxStatus {
  WAITING = 'waiting',
  CHECKED_IN = 'checked_in',
  NO_SHOW = 'no_show',
}

export type PaxStatusString = 'waiting' | 'checked_in' | 'no_show';

export enum CheckInMethod {
  QR = 'qr',
  MANUAL = 'manual',
}

export type CheckInMethodString = 'qr' | 'manual';
