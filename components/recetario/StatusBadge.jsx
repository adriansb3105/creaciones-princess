import { Badge } from '@/components/ui/badge';
import { RECIPE_STATUS_LABELS } from '@/lib/recipes/status';

const STATUS_VARIANTS = {
  borrador: 'outline',
  incompleta: 'outline',
  requiere_revision: 'secondary',
  verificada: 'default',
};

const StatusBadge = ({ status }) => (
  <Badge variant={STATUS_VARIANTS[status] || 'outline'}>{RECIPE_STATUS_LABELS[status] || status}</Badge>
);

export default StatusBadge;
