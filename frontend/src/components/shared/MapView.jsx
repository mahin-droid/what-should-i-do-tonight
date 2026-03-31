export default function MapView({ lat = 23.0225, lon = 72.5714, zoom = 13, markers = [] }) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.05},${lat-0.03},${lon+0.05},${lat+0.03}&layer=mapnik&marker=${lat},${lon}`

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
      <iframe
        title="Map"
        src={mapUrl}
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        className="w-full"
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs text-primary py-2 bg-gray-50 dark:bg-surface-dark hover:underline"
      >
        View larger map ↗
      </a>
    </div>
  )
}
