import { useEffect, useMemo, useRef, useState } from 'react';

const SEAT_OFFSETS = [
  { x: 0, y: -44 },
  { x: 76, y: 0 },
  { x: 0, y: 76 },
  { x: -76, y: 0 },
];

const TABLE_LAYOUT = {
  'Near Outlet': { x: 170, y: 130, rotation: -18 },
  'Near Window': { x: 540, y: 120, rotation: 10 },
  'Under AC': { x: 365, y: 380, rotation: 0 },
};

const SCENE_WIDTH = 920;
const SCENE_HEIGHT = 720;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function groupSeats(seats) {
  return seats.reduce((acc, seat) => {
    if (!acc[seat.table_label]) acc[seat.table_label] = [];
    acc[seat.table_label].push(seat);
    return acc;
  }, {});
}

export default function InteractiveSeatMap({ seats, selectedSeatId, onSelectSeat, interactive = true }) {
  const containerRef = useRef(null);
  const dragState = useRef({
    dragging: false,
    moved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const [view, setView] = useState({ x: -120, y: -70, scale: 1 });
  const [panning, setPanning] = useState(false);

  const grouped = useMemo(() => groupSeats(seats), [seats]);

  const resetView = () => setView({ x: -120, y: -70, scale: 1 });

  const updatePan = (clientX, clientY) => {
    if (!dragState.current.dragging) return;
    const dx = clientX - dragState.current.startX;
    const dy = clientY - dragState.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragState.current.moved = true;
    setView((current) => ({
      ...current,
      x: dragState.current.originX + dx,
      y: dragState.current.originY + dy,
    }));
  };

  const beginPan = (clientX, clientY, pointerId) => {
    dragState.current = {
      dragging: true,
      moved: false,
      pointerId,
      startX: clientX,
      startY: clientY,
      originX: view.x,
      originY: view.y,
    };
    setPanning(true);
  };

  const endPan = () => {
    dragState.current.dragging = false;
    dragState.current.pointerId = null;
    setPanning(false);
  };

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    beginPan(e.clientX, e.clientY, e.pointerId);
  };

  const handlePointerMove = (e) => {
    updatePan(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    endPan();
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setView((current) => ({
      ...current,
      scale: clamp(Number((current.scale + delta).toFixed(2)), 0.7, 1.35),
    }));
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    beginPan(e.clientX, e.clientY, 'mouse');
  };

  const handleMouseMove = (e) => {
    updatePan(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    endPan();
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    beginPan(touch.clientX, touch.clientY, touch.identifier);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    updatePan(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    endPan();
  };

  useEffect(() => {
    const canvas = containerRef.current;
    if (!canvas) return undefined;

    const onPointerDownNative = (event) => handlePointerDown(event);
    const onPointerMoveNative = (event) => handlePointerMove(event);
    const onPointerUpNative = (event) => handlePointerUp(event);
    const onPointerCancelNative = (event) => handlePointerUp(event);
    const onMouseDownNative = (event) => handleMouseDown(event);
    const onMouseMoveNative = (event) => handleMouseMove(event);
    const onMouseUpNative = (event) => handleMouseUp(event);
    const onMouseLeaveNative = (event) => handleMouseUp(event);
    const onTouchStartNative = (event) => handleTouchStart(event);
    const onTouchMoveNative = (event) => handleTouchMove(event);
    const onTouchEndNative = (event) => handleTouchEnd(event);
    const onWheelNative = (event) => handleWheel(event);

    canvas.addEventListener('pointerdown', onPointerDownNative);
    canvas.addEventListener('pointermove', onPointerMoveNative);
    canvas.addEventListener('pointerup', onPointerUpNative);
    canvas.addEventListener('pointercancel', onPointerCancelNative);
    canvas.addEventListener('mousedown', onMouseDownNative);
    canvas.addEventListener('mousemove', onMouseMoveNative);
    canvas.addEventListener('mouseup', onMouseUpNative);
    canvas.addEventListener('mouseleave', onMouseLeaveNative);
    canvas.addEventListener('touchstart', onTouchStartNative, { passive: false });
    canvas.addEventListener('touchmove', onTouchMoveNative, { passive: false });
    canvas.addEventListener('touchend', onTouchEndNative);
    canvas.addEventListener('wheel', onWheelNative, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDownNative);
      canvas.removeEventListener('pointermove', onPointerMoveNative);
      canvas.removeEventListener('pointerup', onPointerUpNative);
      canvas.removeEventListener('pointercancel', onPointerCancelNative);
      canvas.removeEventListener('mousedown', onMouseDownNative);
      canvas.removeEventListener('mousemove', onMouseMoveNative);
      canvas.removeEventListener('mouseup', onMouseUpNative);
      canvas.removeEventListener('mouseleave', onMouseLeaveNative);
      canvas.removeEventListener('touchstart', onTouchStartNative);
      canvas.removeEventListener('touchmove', onTouchMoveNative);
      canvas.removeEventListener('touchend', onTouchEndNative);
      canvas.removeEventListener('wheel', onWheelNative);
    };
  }, []);

  const handleSeatClick = (seat) => {
    if (dragState.current.moved) return;
    if (interactive && seat.current_status === 'available') {
      onSelectSeat?.(seat);
    }
  };

  return (
    <div className="interactive-map-shell">
      <div className="flex-between mb-16" style={{ gap: 12 }}>
        <p className="text-muted" style={{ fontSize: 12 }}>Drag to pan. Use the wheel to zoom.</p>
        <button
          type="button"
          onClick={resetView}
          className="text-muted"
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          Reset view
        </button>
      </div>

      <div
        ref={containerRef}
        className="interactive-map-canvas"
        style={{ cursor: panning ? 'grabbing' : 'grab' }}
      >
        <div
          className="interactive-map-scene"
          style={{
            width: SCENE_WIDTH,
            height: SCENE_HEIGHT,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          }}
        >
          <div className="interactive-map-floor" />
          <div className="interactive-map-aisle interactive-map-aisle-vertical" />
          <div className="interactive-map-aisle interactive-map-aisle-horizontal" />

          {Object.entries(grouped).map(([label, tableSeats]) => {
            const tablePos = TABLE_LAYOUT[label] || { x: 80, y: 80, rotation: 0 };
            return (
              <div
                key={label}
                className="interactive-map-table"
                style={{ left: tablePos.x, top: tablePos.y, transform: `rotate(${tablePos.rotation}deg)` }}
              >
                <div className="interactive-map-table-surface" />
                <p className="interactive-map-table-label">{label}</p>

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
                      }}
                      onClick={() => handleSeatClick(seat)}
                      disabled={interactive && !isAvailable}
                      title={`Seat ${seat.seat_id} — ${seat.current_status}`}
                    >
                      {seat.seat_id}
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