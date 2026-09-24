import { ExternalLink } from 'lucide-react';
import { PLATFORM_LABELS } from '@/lib/recipes/platforms';

const SourceBadge = ({ source }) => {
  if (!source?.url) return null;

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-mint-700 bg-mint-50 hover:bg-mint-100 transition-colors px-3 py-1.5 rounded-full"
    >
      <ExternalLink className="h-3.5 w-3.5" />
      {source.platform ? PLATFORM_LABELS[source.platform] || source.platform : 'Fuente'}
      {source.author ? ` · ${source.author}` : ''}
    </a>
  );
};

export default SourceBadge;
