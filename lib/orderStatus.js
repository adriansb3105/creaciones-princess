export const STATUS_LABELS = {
  pending_payment: 'Pendiente de adelanto',
  deposit_confirmed: 'Adelanto confirmado',
  in_progress: 'En preparación',
  ready: 'Listo',
  completed: 'Entregado',
  cancelled: 'Cancelado',
};

export const STATUS_VARIANTS = {
  pending_payment: 'outline',
  deposit_confirmed: 'secondary',
  in_progress: 'secondary',
  ready: 'default',
  completed: 'default',
  cancelled: 'destructive',
};

export const VALID_STATUSES = Object.keys(STATUS_LABELS);
