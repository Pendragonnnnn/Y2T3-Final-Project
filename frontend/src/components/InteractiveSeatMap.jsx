import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const SEAT_OFFSETS = [
  { x: 45, y: -15 },
  { x: 125, y: -15 },
  { x: 45, y: 130 },
  { x: 125, y: 130 },
];

const OBSTACLES = [
  { id: 'wall-1', x: 590, y: 150, width: 40, height: 200, rotation: 0 },
  { id: 'pillar-1', x: 550, y: 870, width: 40, height: 100, rotation: 0 },
  { id: 'shelf-1', x: 1510, y: 600, width: 40, height: 370, rotation: 0 },
  { id: 'shelf-2', x: 1510, y: 200, width: 40, height: 370, rotation: 0 },
  { id: 'door-1', x: 12, y: 750, width: 90, height: 70, rotation: 90, shape: 'semi-circle'},
];


const SCENE_WIDTH = 1180*1.333;
const SCENE_HEIGHT = 900*1.333;

const MIN_SCALE = 0.4;
const MAX_SCALE = 1.35;
const ZOOM_STEP = 0.04;

// Pointer needs to move this many px before a press counts as a drag
// rather than a tap (otherwise a tiny shake while tapping a seat would
// get swallowed as a "pan").
const DRAG_THRESHOLD = 4;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function groupSeats(seats) {
  return seats.reduce((acc, seat) => {
    
    if (!acc[seat.table_id]) acc[seat.table_id] = [];
    acc[seat.table_id].push(seat);
    return acc;
  }, {});
}

// How far the scene is allowed to translate at a given scale so it never
// reveals empty space past its own edges inside the container.
function getPanBounds(scale, containerWidth, containerHeight) {
  const scaledWidth = SCENE_WIDTH * scale;
  const scaledHeight = SCENE_HEIGHT * scale;

  const minX = Math.min(0, containerWidth - scaledWidth);
  const maxX = Math.max(0, containerWidth - scaledWidth);
  const minY = Math.min(0, containerHeight - scaledHeight);
  const maxY = Math.max(0, containerHeight - scaledHeight);

  return { minX, maxX, minY, maxY };
}

function getCenteredView(scale, containerWidth, containerHeight) {
  const scaledWidth = SCENE_WIDTH * scale;
  const scaledHeight = SCENE_HEIGHT * scale;
  const bounds = getPanBounds(scale, containerWidth, containerHeight);

  return {
    scale,
    x: clamp((containerWidth - scaledWidth) / 2, bounds.minX, bounds.maxX),
    y: clamp((containerHeight - scaledHeight) / 2, bounds.minY, bounds.maxY),
  };
}

export default function InteractiveSeatMap({ seats, selectedSeatId, onSelectSeat, interactive = true }) {
  const containerRef = useRef(null);
  const dragState = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [panning, setPanning] = useState(false);

  const grouped = useMemo(() => groupSeats(seats), [seats]);

  const centerView = (scale = 1) => {
    const container = containerRef.current;
    if (!container) return;
    setView(getCenteredView(scale, container.clientWidth, container.clientHeight));
  };

  // Center on first mount. useLayoutEffect avoids a one-frame flash at (0,0)
  // before we know the real container size.
  useLayoutEffect(() => {
    centerView(1);
  }, []);

  // If the container changes size later (e.g. orientation change, sidebar
  // toggle), re-clamp so the current view can't end up out of bounds.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(() => {
      setView((current) => {
        const bounds = getPanBounds(current.scale, container.clientWidth, container.clientHeight);
        return {
          ...current,
          x: clamp(current.x, bounds.minX, bounds.maxX),
          y: clamp(current.y, bounds.minY, bounds.maxY),
        };
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const beginPan = (clientX, clientY, pointerId) => {
    setView((current) => {
      dragState.current = {
        pointerId,
        startX: clientX,
        startY: clientY,
        originX: current.x,
        originY: current.y,
        moved: false,
      };
      return current;
    });
    setPanning(true);
  };

  const updatePan = (clientX, clientY) => {
    const drag = dragState.current;
    if (drag.pointerId === null) return;

    const container = containerRef.current;
    if (!container) return;

    const dx = clientX - drag.startX;
    const dy = clientY - drag.startY;

    if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      drag.moved = true;
    }

    setView((current) => {
      const bounds = getPanBounds(current.scale, container.clientWidth, container.clientHeight);
      return {
        ...current,
        x: clamp(drag.originX + dx, bounds.minX, bounds.maxX),
        y: clamp(drag.originY + dy, bounds.minY, bounds.maxY),
      };
    });
  };

  const endPan = () => {
    dragState.current.pointerId = null;
    setPanning(false);
  };

  const handlePointerDown = (e) => {
    if (e.target.closest('button')) return;
    if (e.button !== undefined && e.button !== 0) return;
    
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    beginPan(e.clientX, e.clientY, e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (dragState.current.pointerId === null) return;
    updatePan(e.clientX, e.clientY);
  };

  const handlePointerUp = () => endPan();

  // Wheel is the one event that genuinely needs a non-passive native
  // listener (React's synthetic onWheel is passive by default, so
  // preventDefault inside it is silently ignored).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const onWheel = (e) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;

      setView((current) => {
        const nextScale = clamp(Number((current.scale + delta).toFixed(2)), MIN_SCALE, MAX_SCALE);
        if (nextScale === current.scale) return current;

        // Keep the point under the cursor visually fixed while zooming,
        // instead of always scaling from the scene's top-left corner.
        const scaleRatio = nextScale / current.scale;
        const nextX = pointerX - (pointerX - current.x) * scaleRatio;
        const nextY = pointerY - (pointerY - current.y) * scaleRatio;

        const bounds = getPanBounds(nextScale, container.clientWidth, container.clientHeight);
        return {
          scale: nextScale,
          x: clamp(nextX, bounds.minX, bounds.maxX),
          y: clamp(nextY, bounds.minY, bounds.maxY),
        };
      });
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  const handleSeatClick = (seat) => {
    
    if (interactive && seat.current_status === 'available') {
    onSelectSeat?.(seat);
  }
  };
  const isSeatSelectable = (seat, interactive) => {
  return interactive && seat.current_status === 'available';
};


  return (
    <div className="interactive-map-shell">
      <div className="flex-between mb-16" style={{ gap: 1 }}>
        <p className="text-muted" style={{ fontSize: 12 }}>Drag to pan. Use the wheel to zoom.</p>
      </div>
      

      <div
        ref={containerRef}
        className="interactive-map-canvas"
        style={{ cursor: panning ? 'grabbing' : 'grab', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        
        <div
          className="interactive-map-scene"
          style={{
            width: SCENE_WIDTH,
            height: SCENE_HEIGHT,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
            transformOrigin: '0 0',
          }}
        >
          
          {/* Render Obstacles */}
        {OBSTACLES.map((obstacle) => (
          <div
            key={obstacle.id}
            className="map-obstacle"
            style={{
              position: 'absolute',
              left: `${obstacle.x}px`,
              top: `${obstacle.y}px`,
              width: `${obstacle.width}px`,
              height: `${obstacle.height}px`,
              transform: `rotate(${obstacle.rotation}deg)`,
              background: "linear-gradient(1350deg, #b4d2fe58 0%, #749edc1e 100%)", // Your blue obstruction color
              pointerEvents: 'none', // Ensures they don't block mouse interactions
              borderColor: "#2c2c2d",
              boxShadow: "inset 5px 0px 4px rgba(104, 104, 104, 0.28)",
              borderRadius: obstacle.shape === 'semi-circle' ? `${obstacle.width / 2}px ${obstacle.width / 2}px 0 0` : '4px',
            }}
          />
        ))}
          <div className="interactive-map-floor" />
          <div className="interactive-map-aisle interactive-map-aisle-vertical" />
          <div className="interactive-map-aisle interactive-map-aisle-horizontal" />

          {Object.entries(grouped).map(([tableId, tableSeats]) => {
  // Only declare these once!
          const tableData = tableSeats[0]; 
          const label = tableData.table_label;
          const posX = (tableData.positionX)*1.333;
          const posY = (tableData.positionY)*1.333;
          const rotation = (tableData.rotation) ?? 0;

          return (
            <div
              key={tableId}
              className="interactive-map-table"
              style={{ 
                position: 'absolute', 
                left: posX, 
                top: posY, 
                transform: `rotate(${rotation}deg)` 
              }}
            >
              <div className="interactive-map-table-surface" />
              

              {tableSeats.slice(0, 4).map((seat, index) => {
                const seatOffset = SEAT_OFFSETS[index] || SEAT_OFFSETS[0];
                const isSelected = seat.seat_id === selectedSeatId;
                const isAvailable = seat.current_status === 'available';

                return (
                  <button
                    key={seat.seat_id}
                    type="button"
                    className={`seat-cell interactive-seat ${seat.current_status}${isSelected ? ' selected' : ''}`}
                    style={{
                      left: seatOffset.x,
                      top: seatOffset.y,
                      transform: `rotate(${-rotation}deg)`
                    }}
                    onClick={() => isSeatSelectable(seat, interactive) && onSelectSeat?.(seat)}
  disabled={interactive && seat.current_status !== 'available'}
                    data-status={seat.current_status.toUpperCase()}
                  >
                    ▢
                  </button>
                );
              })}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}