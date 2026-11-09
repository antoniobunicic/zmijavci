export interface MapPoint {
  x: string;
  y: string;
}

const pointKey = ({ x, y }: MapPoint) => `${x},${y}`;

/** Položaj kadra na karti zapisan je na njegovoj traci napretka. */
export const pointOfSegment = (segment: HTMLElement): MapPoint => ({
  x: segment.dataset.dotX ?? '0',
  y: segment.dataset.dotY ?? '0',
});

/** Sve lokacije su stalno na karti kao manje točke, a aktivna dobiva svijetlu točku s pulsom. */
export function createLocationMap(hero: HTMLElement) {
  const points = [...hero.querySelectorAll<HTMLElement>('.segment')].map(pointOfSegment);
  const dots = [...hero.querySelectorAll<HTMLElement>('[data-dot]')];
  const uniqueKeys = [...new Set(points.map(pointKey))];

  const markers = uniqueKeys.map((key) => {
    const [x, y] = key.split(',');
    const marker = document.createElement('span');
    marker.className = 'hero__marker';
    marker.setAttribute('aria-hidden', 'true');
    marker.style.left = `${x}%`;
    marker.style.top = `${y}%`;
    dots[0]?.before(marker);
    return marker;
  });

  const show = (point: MapPoint) => {
    dots.forEach((dot) => {
      dot.style.left = `${point.x}%`;
      dot.style.top = `${point.y}%`;
    });
    markers.forEach((marker, index) => {
      marker.classList.toggle('is-current', uniqueKeys[index] === pointKey(point));
    });
  };

  show(points[0]);

  return { show };
}
