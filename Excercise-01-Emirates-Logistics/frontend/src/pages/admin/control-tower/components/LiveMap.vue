<template>
  <div ref="mapElement" class="map-wrapper">
    <div class="osm-tile-layer">
      <img
        v-for="tile in visibleTiles"
        :key="tile.key"
        class="osm-tile"
        :src="tile.url"
        :style="{ left: `${tile.left}px`, top: `${tile.top}px` }"
        alt=""
        loading="lazy"
        draggable="false"
      />
    </div>

    <svg class="route-svg" v-if="selectedRouteLine">
      <line
        :x1="selectedRouteLine.x1"
        :y1="selectedRouteLine.y1"
        :x2="selectedRouteLine.x2"
        :y2="selectedRouteLine.y2"
        class="route-shadow"
      />
      <line
        :x1="selectedRouteLine.x1"
        :y1="selectedRouteLine.y1"
        :x2="selectedRouteLine.x2"
        :y2="selectedRouteLine.y2"
        class="route-path"
      />
    </svg>

    <div
      v-for="hub in visibleHubs"
      :key="hub.name"
      class="map-pin"
      :style="{ left: `${hub.x}px`, top: `${hub.y}px` }"
      :title="hub.name"
    >
      <div class="pin-dot"></div>
      <span class="pin-label">{{ hub.shortName }}</span>
    </div>

    <div
      v-if="selectedTripLocation"
      class="truck-pin"
      :style="{ left: `${selectedTripLocation.x}px`, top: `${selectedTripLocation.y}px` }"
    >
      <div class="pulse-ring"></div>
      <div class="truck-icon">
        <i class="pi pi-truck"></i>
      </div>
      <span class="truck-label">{{ selectedTrip.id }} ({{ selectedTrip.progress }}%)</span>
    </div>

    <div class="map-overlay-info" v-if="selectedTrip">
      <div class="overlay-details">
        <span>Tracking <strong>{{ selectedTrip.id }}</strong></span>
        <span>Vehicle: {{ selectedTrip.vehicle ? selectedTrip.vehicle.split(' (')[0] : 'N/A' }}</span>
        <span>{{ selectedTrip.origin.split(' (')[0] }} to {{ selectedTrip.destination.split(' (')[0] }}</span>
      </div>
    </div>

    <a
      class="map-attribution"
      href="https://www.openstreetmap.org/copyright"
      target="_blank"
      rel="noopener noreferrer"
    >
      © OpenStreetMap contributors
    </a>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
  selectedTrip: Object
});

const TILE_SIZE = 256;
const DEFAULT_CENTER = { lat: 24.85, lng: 55.08 };

const mapElement = ref(null);
const viewport = ref({ width: 0, height: 0 });
let resizeObserver;

const HUB_COORDINATES = {
  'Jebel Ali Port (Dubai)': { lat: 25.0118, lng: 55.0613 },
  'JAFZA Zone 1 (Dubai)': { lat: 25.0267, lng: 55.1167 },
  'Dubai South Warehouse (Dubai)': { lat: 24.895, lng: 55.1614 },
  'Dubai Logistics City (Dubai)': { lat: 24.9327, lng: 55.1879 },
  'Dubai Industrial City (Dubai)': { lat: 24.7906, lng: 55.1212 },
  'Sharjah Warehouse Zone (Sharjah)': { lat: 25.3463, lng: 55.4209 },
  'Abu Dhabi Industrial Zone (Abu Dhabi)': { lat: 24.3339, lng: 54.5196 },
  'Abu Dhabi Port (Abu Dhabi)': { lat: 24.8064, lng: 54.6536 }
};

const project = ({ lat, lng }, zoom) => {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const scale = TILE_SIZE * 2 ** zoom;

  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale
  };
};

const selectedRouteCoordinates = computed(() => {
  if (!props.selectedTrip) return null;

  const start = HUB_COORDINATES[props.selectedTrip.origin];
  const end = HUB_COORDINATES[props.selectedTrip.destination];

  if (!start || !end) return null;
  return { start, end };
});

const mapZoom = computed(() => {
  const route = selectedRouteCoordinates.value;
  if (!route) return 9;

  const latDelta = Math.abs(route.start.lat - route.end.lat);
  const lngDelta = Math.abs(route.start.lng - route.end.lng);
  const maxDelta = Math.max(latDelta, lngDelta);

  if (maxDelta < 0.25) return 11;
  if (maxDelta < 0.7) return 10;
  return 9;
});

const mapCenter = computed(() => {
  const route = selectedRouteCoordinates.value;
  if (!route) return DEFAULT_CENTER;

  return {
    lat: (route.start.lat + route.end.lat) / 2,
    lng: (route.start.lng + route.end.lng) / 2
  };
});

const topLeftWorldPoint = computed(() => {
  const center = project(mapCenter.value, mapZoom.value);

  return {
    x: center.x - viewport.value.width / 2,
    y: center.y - viewport.value.height / 2
  };
});

const pointToScreen = (coordinate) => {
  const point = project(coordinate, mapZoom.value);

  return {
    x: point.x - topLeftWorldPoint.value.x,
    y: point.y - topLeftWorldPoint.value.y
  };
};

const visibleTiles = computed(() => {
  if (!viewport.value.width || !viewport.value.height) return [];

  const zoom = mapZoom.value;
  const tileCount = 2 ** zoom;
  const topLeft = topLeftWorldPoint.value;
  const startX = Math.floor(topLeft.x / TILE_SIZE);
  const endX = Math.floor((topLeft.x + viewport.value.width) / TILE_SIZE);
  const startY = Math.floor(topLeft.y / TILE_SIZE);
  const endY = Math.floor((topLeft.y + viewport.value.height) / TILE_SIZE);
  const tiles = [];

  for (let x = startX; x <= endX; x += 1) {
    for (let y = startY; y <= endY; y += 1) {
      if (y < 0 || y >= tileCount) continue;

      const wrappedX = ((x % tileCount) + tileCount) % tileCount;
      tiles.push({
        key: `${zoom}-${wrappedX}-${y}`,
        url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
        left: x * TILE_SIZE - topLeft.x,
        top: y * TILE_SIZE - topLeft.y
      });
    }
  }

  return tiles;
});

const visibleHubs = computed(() => {
  return Object.entries(HUB_COORDINATES).map(([name, coordinate]) => {
    const point = pointToScreen(coordinate);

    return {
      name,
      shortName: name.split(' (')[0],
      x: point.x,
      y: point.y
    };
  });
});

const selectedRouteLine = computed(() => {
  const route = selectedRouteCoordinates.value;
  if (!route) return null;

  const start = pointToScreen(route.start);
  const end = pointToScreen(route.end);

  return {
    x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y
  };
});

const selectedTripLocation = computed(() => {
  const route = selectedRouteCoordinates.value;
  if (!route || !props.selectedTrip) return null;

  const progress = Math.min(Math.max(props.selectedTrip.progress || 0, 0), 100) / 100;
  const coordinate = {
    lat: route.start.lat + (route.end.lat - route.start.lat) * progress,
    lng: route.start.lng + (route.end.lng - route.start.lng) * progress
  };

  return pointToScreen(coordinate);
});

const updateViewport = () => {
  if (!mapElement.value) return;

  viewport.value = {
    width: mapElement.value.clientWidth,
    height: mapElement.value.clientHeight
  };
};

onMounted(() => {
  updateViewport();
  resizeObserver = new ResizeObserver(updateViewport);

  if (mapElement.value) {
    resizeObserver.observe(mapElement.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.map-wrapper {
  height: 100%;
  width: 100%;
  background-color: var(--surface-c);
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  position: relative;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.osm-tile-layer,
.route-svg {
  position: absolute;
  inset: 0;
}

.osm-tile {
  position: absolute;
  width: 256px;
  height: 256px;
  user-select: none;
  filter: saturate(0.95) contrast(1.02);
}

.p-dark .osm-tile {
  filter: saturate(0.75) contrast(1.05) brightness(0.72);
}

.route-svg {
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.route-shadow {
  stroke: rgba(15, 23, 42, 0.45);
  stroke-width: 7;
  stroke-linecap: round;
  opacity: 0.35;
}

.route-path {
  stroke: var(--brand-orange);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 9, 8;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
}

.map-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  pointer-events: none;
}

.pin-dot {
  width: 10px;
  height: 10px;
  background-color: #ffffff;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.pin-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-color);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3px 7px;
  border-radius: 6px;
  margin-top: 5px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  white-space: nowrap;
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.12);
}

.p-dark .pin-label {
  background-color: rgba(11, 17, 32, 0.86);
  border-color: rgba(148, 163, 184, 0.24);
}

.truck-pin {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 20;
  transition: left 0.5s ease, top 0.5s ease;
  pointer-events: none;
}

.truck-icon {
  width: 34px;
  height: 34px;
  background-color: var(--brand-orange);
  color: #ffffff;
  border: 2px solid #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(254, 150, 5, 0.4);
  position: relative;
  z-index: 2;
}

.truck-icon i {
  font-size: 15px;
}

.pulse-ring {
  position: absolute;
  width: 34px;
  height: 34px;
  border: 3px solid var(--brand-orange);
  border-radius: 50%;
  animation: map-pulse 2s infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes map-pulse {
  0% { transform: scale(1); opacity: 0.75; }
  100% { transform: scale(2.3); opacity: 0; }
}

.truck-label {
  font-size: 11px;
  font-weight: 800;
  color: #ffffff;
  background-color: var(--brand-orange);
  padding: 3px 8px;
  border-radius: 6px;
  margin-top: 6px;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}

.map-overlay-info {
  position: absolute;
  bottom: 18px;
  left: 18px;
  background-color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 10px;
  padding: 12px 16px;
  backdrop-filter: blur(8px);
  z-index: 30;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);
}

.p-dark .map-overlay-info {
  background-color: rgba(11, 17, 32, 0.88);
  border-color: rgba(148, 163, 184, 0.2);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.35);
}

.overlay-details {
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: var(--text-color);
  font-size: 12px;
  font-weight: 600;
}

.overlay-details strong {
  color: var(--brand-orange);
}

.map-attribution {
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 30;
  background-color: rgba(255, 255, 255, 0.86);
  color: #334155;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 10px;
  line-height: 1.4;
  text-decoration: none;
}

.p-dark .map-attribution {
  background-color: rgba(15, 23, 42, 0.84);
  color: #cbd5e1;
}

@media (max-width: 640px) {
  .map-overlay-info {
    left: 12px;
    right: 12px;
    bottom: 28px;
  }

  .pin-label {
    display: none;
  }
}
</style>
