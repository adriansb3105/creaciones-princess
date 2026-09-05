const YouTubeEmbed = ({ videoId, title = 'Video' }) => {
  if (!videoId) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeEmbed;
