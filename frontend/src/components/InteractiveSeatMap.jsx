import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const SEAT_OFFSETS = [
  { x: 45, y: -15 },
  { x: 125, y: -15 },
  { x: 45, y: 130 },
  { x: 125, y: 130 },
];

const OBSTACLES = [
  { id: 'wall-1',   x: 590,  y: 150, width: 40, height: 200, rotation: 0 },
  { id: 'pillar-1', x: 550,  y: 870, width: 40, height: 100, rotation: 0 },
  { id: 'shelf-1',  x: 1510, y: 600, width: 40, height: 370, rotation: 0 },
  { id: 'shelf-2',  x: 1510, y: 200, width: 40, height: 370, rotation: 0 },
  { id: 'door-1',   x: 12,   y: 750, width: 90, height: 70,  rotation: 90, shape: 'semi-circle' },
];

const SCENE_WIDTH  = 1180 * 1.333;
const SCENE_HEIGHT = 900  * 1.333;
const MIN_SCALE    = 0.4;
const MAX_SCALE    = 1.35;
const ZOOM_STEP    = 0.04;
const DRAG_THRESHOLD = 4;

function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

function groupSeats(seats) {
  return seats.reduce((acc, seat) => {
    if (!acc[seat.table_id]) acc[seat.table_id] = [];
    acc[seat.table_id].push(seat);
    return acc;
  }, {});
}

function getPanBounds(scale, cW, cH) {
  const sW = SCENE_WIDTH * scale, sH = SCENE_HEIGHT * scale;
  const centerX = (cW - sW) / 2;
  const centerY = (cH - sH) / 2;
  return {
    minX: sW <= cW ? centerX : cW - sW,
    maxX: sW <= cW ? centerX : 0,
    minY: sH <= cH ? centerY : cH - sH,
    maxY: sH <= cH ? centerY : 0,
  };
}

function getCenteredView(scale, cW, cH) {
  const sW = SCENE_WIDTH * scale, sH = SCENE_HEIGHT * scale;
  const b = getPanBounds(scale, cW, cH);
  return { scale, x: clamp((cW - sW) / 2, b.minX, b.maxX), y: clamp((cH - sH) / 2, b.minY, b.maxY) };
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Student-mode palette (light, airy)
const STUDENT_SEAT_CONFIG = {
  available: { bg: '#dcfce7', border: '#16a34a', color: '#15803d' },
  occupied:  { bg: '#fee2e2', border: '#dc2626', color: '#b91c1c' },
  blocked:   { bg: '#f1f5f9', border: '#94a3b8', color: '#64748b' },
  pending:   { bg: '#e6f2ff', border: '#3b82f6', color: '#1e40af' },
  active:    { bg: '#dbeafe', border: '#2563eb', color: '#1e3a8a' },
};

// Manager-mode palette (dark, utilitarian)
const MANAGER_SEAT_CONFIG = {
  available: { bg: 'rgba(34,197,94,0.15)',  border: '#22c55e', color: '#4ade80' },
  occupied:  { bg: 'rgba(251,146,60,0.18)', border: '#f97316', color: '#fb923c' },
  blocked:   { bg: 'rgba(100,116,139,0.2)', border: '#475569', color: '#94a3b8' },
  pending:   { bg: 'rgba(59,130,246,0.12)', border: '#3b82f6', color: '#60a5fa' },
  active:    { bg: 'rgba(37,99,235,0.12)', border: '#2563eb', color: '#3b82f6' },
};

/**
 * Shared seat map component.
 *
 * mode="student" (default):
 *   - Light background, tapping an available seat selects it (for reserving)
 *   - onSelectSeat(seat) fires on tap
 *
 * mode="manager":
 *   - Dark background, occupied seats show occupant initials
 *   - Tapping ANY seat (regardless of status) fires onSeatAction-driven bottom sheet
 *   - onManagerSeatTap(seat) fires on tap — parent renders the open/block bottom sheet
 */
export default function InteractiveSeatMap({
  seats,
  selectedSeatId,
  highlightedSeatId,
  onSelectSeat,
  interactive = true,
  mode = 'student',
  onManagerSeatTap,
}) {
  const isManager = mode === 'manager';
  const SEAT_CONFIG = isManager ? MANAGER_SEAT_CONFIG : STUDENT_SEAT_CONFIG;

  const containerRef = useRef(null);
  const dragState = useRef({ pointerId: null, startX: 0, startY: 0, originX: 0, originY: 0, moved: false });
  const [view, setView]       = useState({ x: 0, y: 0, scale: 1 });
  const [panning, setPanning] = useState(false);
  const grouped = useMemo(() => groupSeats(seats), [seats]);

  useLayoutEffect(() => {
    const c = containerRef.current;
    if (c) setView(getCenteredView(1, c.clientWidth, c.clientHeight));
  }, []);

  useEffect(() => {
    const c = containerRef.current;
    if (!c || typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver(() =>
      setView(cur => {
        const b = getPanBounds(cur.scale, c.clientWidth, c.clientHeight);
        return { ...cur, x: clamp(cur.x, b.minX, b.maxX), y: clamp(cur.y, b.minY, b.maxY) };
      })
    );
    obs.observe(c);
    return () => obs.disconnect();
  }, []);

  const beginPan = (cx, cy, pid) => {
    setView(cur => { dragState.current = { pointerId: pid, startX: cx, startY: cy, originX: cur.x, originY: cur.y, moved: false }; return cur; });
    setPanning(true);
  };
  const updatePan = (cx, cy) => {
    const d = dragState.current; if (d.pointerId === null) return;
    const c = containerRef.current; if (!c) return;
    const dx = cx - d.startX, dy = cy - d.startY;
    if (!d.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) d.moved = true;
    setView(cur => { const b = getPanBounds(cur.scale, c.clientWidth, c.clientHeight); return { ...cur, x: clamp(d.originX + dx, b.minX, b.maxX), y: clamp(d.originY + dy, b.minY, b.maxY) }; });
  };
  const endPan = () => { dragState.current.pointerId = null; setPanning(false); };

  const handlePointerDown = e => {
    if (e.target.closest('button')) {
      // Reset stale drag state so a tap on a seat isn't mistaken for
      // a leftover drag from a previous pan gesture.
      dragState.current.moved = false;
      return;
    }
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    beginPan(e.clientX, e.clientY, e.pointerId);
  };

  useEffect(() => {
    const c = containerRef.current; if (!c) return;
    const onWheel = e => {
      e.preventDefault();
      const rect = c.getBoundingClientRect();
      const px = e.clientX - rect.left, py = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setView(cur => {
        const ns = clamp(Number((cur.scale + delta).toFixed(2)), MIN_SCALE, MAX_SCALE);
        if (ns === cur.scale) return cur;
        const r = ns / cur.scale;
        const b = getPanBounds(ns, c.clientWidth, c.clientHeight);
        return { scale: ns, x: clamp(px - (px - cur.x) * r, b.minX, b.maxX), y: clamp(py - (py - cur.y) * r, b.minY, b.maxY) };
      });
    };
    c.addEventListener('wheel', onWheel, { passive: false });
    return () => c.removeEventListener('wheel', onWheel);
  }, []);

  const handleSeatClick = (seat) => {
    console.log('handleSeatClick fired', seat, 'isManager:', isManager, 'moved:', dragState.current.moved);
    if (dragState.current.moved) return; // was a drag, not a tap

    if (isManager) {
      onManagerSeatTap?.(seat);
      return;
    }

    if (interactive && seat.current_status === 'available') {
      onSelectSeat?.(seat);
    }
    console.log(seat);
  };

  const isSeatSelectable = (seat) => {
    if (isManager) return true; // any seat is tappable in manager mode
    return interactive && seat.current_status === 'available';
  };

  const availableCount = seats.filter(s => s.current_status === 'available').length;
  const occupiedCount  = seats.filter(s => s.current_status === 'occupied').length;
  const blockedCount   = seats.filter(s => s.current_status === 'blocked').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Legend strip ── */}
      <div className='file-b-container'>
        <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
          {isManager ? 'Tap a seat to manage it' : ''}
        </p>
      </div>

      {/* ── Map canvas ── */}
      <div
        ref={containerRef}
        className="interactive-seat-map"
        style={{
          position: 'relative', width: '100%', height: 640,
          overflow: 'hidden', borderRadius: 20,
          background: 'var(--map-bg)',
          border:  '1.5px solid #5a6a80',
          boxShadow:'0 12px 40px rgba(0,0,0,0.18)',
          cursor: panning ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={e => { if (dragState.current.pointerId !== null) updatePan(e.clientX, e.clientY); }}
        onPointerUp={endPan}
        onPointerCancel={endPan}
      >
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: SCENE_WIDTH, height: SCENE_HEIGHT,
          transform: `translate(${view.x}px,${view.y}px) scale(${view.scale})`,
          transformOrigin: '0 0',
        }}>
          {/* Floor */}
          <div style={{
            position: 'absolute', inset: 20, borderRadius: 24,
            background: 'var(--map-surface)',
            border: '1px solid #607080',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.25)',
          }} />

          {/* Grid lines */}
          <svg style={{ position: 'absolute', inset: 20, pointerEvents: 'none', opacity:  0.08 }}
            width={SCENE_WIDTH - 40} height={SCENE_HEIGHT - 40}>
            {Array.from({ length: 30 }, (_, i) => (
              <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={SCENE_HEIGHT} stroke={'var(--map-line)'} strokeWidth={1} />
            ))}
            {Array.from({ length: 22 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 60} x2={SCENE_WIDTH} y2={i * 60} stroke={'var(--map-line)'} strokeWidth={1} />
            ))}
          </svg>

          {/* Obstacles */}
          {OBSTACLES.map(o => (
            <div key={o.id} style={{
              position: 'absolute', left: o.x, top: o.y, width: o.width, height: o.height,
              transform: `rotate(${o.rotation}deg)`,
              background: 'linear-gradient(135deg, rgba(180,210,254,0.12) 0%, rgba(116,158,220,0.08) 100%)',
              border: '1.5px solid rgba(115,159,206,0.3)',
              boxShadow:  'inset 3px 0 6px rgba(104,104,104,0.15)',
              borderRadius: o.shape === 'semi-circle' ? `${o.width / 2}px ${o.width / 2}px 0 0` : 6,
              pointerEvents: 'none',
            }} />
          ))}

          {/* Tables + seats */}
          {Object.entries(grouped).map(([tableId, tableSeats]) => {
            const td = tableSeats[0];
            const posX = td.positionX * 1.333;
            const posY = td.positionY * 1.333;
            const rotation = td.rotation ?? 0;

            return (
              <div key={tableId} style={{ position: 'absolute', left: posX, top: posY, width: 220, height: 160, transform: `rotate(${rotation}deg)` }}>
                {/* Table surface */}
                <div style={{
                  position: 'absolute', inset: 34,
                  background:'var(--table-surface)',
                  borderRadius: 6,
                  border:  '1px solid rgba(255,255,255,0.1)',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
                }} />

                {/* Seats */}
                {tableSeats.slice(0, 4).map((seat, idx) => {
                  const offset = SEAT_OFFSETS[idx] || SEAT_OFFSETS[0];
                  const isSelected = seat.seat_id === selectedSeatId;
                  const isHighlighted = seat.seat_id === highlightedSeatId;
                  const cfg = SEAT_CONFIG[seat.current_status] || SEAT_CONFIG.blocked;
                  const canTap = isSeatSelectable(seat);
                  const hasOccupant = isManager && seat.current_status === 'occupied' && seat.occupant_name;

                  return (
                    <button
                      key={seat.seat_id}
                      type="button"
                      disabled={!isManager && interactive && seat.current_status !== 'available'}
                      onClick={() => canTap && handleSeatClick(seat)}
                      style={{
                        position: 'absolute',
                        left: offset.x, top: offset.y,
                        width: 44, height: 44,
                        borderRadius: '50%',
                        transform: `rotate(${-rotation}deg)`,
                        background: isHighlighted
                          ? '#fde68a'
                          : isSelected
                            ? ('var(--color-primary)')
                            : cfg.bg,
                        border: `2px solid ${isHighlighted ? '#f59e0b' : isSelected ? ('var(--color-primary)') : cfg.border}`,
                        color: isHighlighted ? '#92400e' : isSelected ? ('#fff') : cfg.color,
                        fontSize: hasOccupant ? 9 : 10,
                        fontWeight: 700,
                        cursor: canTap ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isHighlighted
                          ? ('0 0 0 3px rgba(245,158,11,0.35), 0 6px 16px rgba(245,158,11,0.28)')
                          : isSelected
                            ? ('0 0 0 3px rgba(11,86,164,0.35), 0 4px 12px rgba(11,86,164,0.4)')
                            : ('0 3px 8px rgba(0,0,0,0.25)'),
                        transition: 'all 0.15s ease',
                        opacity: !isManager && seat.current_status === 'blocked' ? 0.6 : 1,
                      }}
                      title={`Seat ${seat.seat_id} — ${(seat.current_status).toUpperCase()}`}
                    >
                      {isHighlighted ? '✓' : seat.seat_id}
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
