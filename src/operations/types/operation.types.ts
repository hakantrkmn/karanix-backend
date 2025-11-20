export enum OperationStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type OperationStatusString =
  | 'planned'
  | 'active'
  | 'completed'
  | 'cancelled';
