export default function SeatGrid({ seats, selectedSeatId, onSelectSeat, interactive = true }) {
  const grouped = seats.reduce((acc, seat) => {
    acc[seat.table_label] = acc[seat.table_label] || [];
    acc[seat.table_label].push(seat);
    return acc;
  }, {});

  return (
    <div className="stack">
      {Object.entries(grouped).map(([label, tableSeats]) => (
        <div key={label}>
          <p className="text-muted" style={{ marginBottom: 6, fontWeight: 600 }}>Table {label}</p>
          <div className="seat-grid">
            {tableSeats.map((seat) => {
              const isSelected = seat.seat_id === selectedSeatId;
              const clickable = interactive && seat.current_status === 'available';
              return (
                <div
                  key={seat.seat_id}
                  className={`seat-cell ${seat.current_status}${isSelected ? ' selected' : ''}`}
                  onClick={() => clickable && onSelectSeat?.(seat)}
                  title={`Seat ${seat.seat_id} — ${seat.current_status}`}
                >
                  {seat.seat_id}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
