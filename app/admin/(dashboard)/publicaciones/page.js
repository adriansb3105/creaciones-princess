'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Instagram, Facebook, CheckCircle2, XCircle, Clock, MinusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getCloudinaryVideoThumbnail } from '@/lib/utils';

const STATUS_ICON = {
  success: { icon: CheckCircle2, color: 'text-mint-600' },
  error: { icon: XCircle, color: 'text-red-500' },
  processing: { icon: Clock, color: 'text-amber-600' },
  pending: { icon: Clock, color: 'text-amber-600' },
  skipped: { icon: MinusCircle, color: 'text-gray-300' },
};

function StatusBadge({ icon: PlatformIcon, label, result }) {
  const config = STATUS_ICON[result?.status] || STATUS_ICON.skipped;
  const StatusIcon = config.icon;
  const content = (
    <span className={`inline-flex items-center gap-1 text-sm ${config.color}`}>
      <PlatformIcon className="h-4 w-4" />
      <StatusIcon className="h-3.5 w-3.5" />
    </span>
  );
  return result?.status === 'success' && result?.permalink ? (
    <a href={result.permalink} target="_blank" rel="noopener noreferrer" title={label}>
      {content}
    </a>
  ) : (
    <span title={result?.error || label}>{content}</span>
  );
}

export default function AdminPublicacionesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/social/publish')
      .then((r) => r.json())
      .then((data) => setPosts(data?.posts || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Publicaciones de entregas</h1>

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">Todavía no se ha publicado ninguna entrega.</p>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {posts.map((post) => {
            const thumb = post.images?.[0] || (post.videoUrl ? getCloudinaryVideoThumbnail(post.videoUrl) : null);
            return (
              <Card key={post.id} className="border-pink-100">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-mint-50 flex-shrink-0">
                    {thumb && <Image src={thumb} alt={post.productName || 'Publicación'} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{post.productName || 'Sin producto'}</p>
                    <p className="text-sm text-gray-500 truncate">{post.caption}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge icon={Instagram} label="Instagram" result={post.results?.instagram} />
                    <StatusBadge icon={Facebook} label="Facebook" result={post.results?.facebook} />
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(post.createdAt).toLocaleDateString('es-CR')}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
