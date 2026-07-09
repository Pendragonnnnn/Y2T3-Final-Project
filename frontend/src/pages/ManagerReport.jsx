import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import api from '../services/api';
import BottomNav from '../components/BottomNav';

const SENTIMENT_COLORS = {
  bug: '#E74C3C',
  feature_request: '#4095F6',
  management_issue: '#F5A623',
  general: '#A0AAC2',
};

function DonutStat({ percent, label, color, value }) {
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle cx="38" cy="38" r="32" fill="none" stroke="#EEF1F6" strokeWidth="8" />
        <circle
          cx="38" cy="38" r="32" fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 38 38)"
        />
        <text x="38" y="43" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--color-text-primary)">
          {value}
        </text>
      </svg>
      <p className="text-muted mt-8" style={{ fontSize: 12 }}>{label}</p>
    </div>
  );
}

export default function ManagerReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/manager/report')
      .then(({ data }) => setReport(data))
      .catch((err) => console.error("Error fetching report data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="screen">
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
        <BottomNav />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="screen">
        <div className="text-center mt-24 text-red-500">
          <p className="font-semibold">Failed to load analytics report.</p>
          <p className="text-sm text-muted mt-2">Check your backend console or database server status.</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const { seatOccupancy, satisfaction, reservationStats, peakHours } = report;
  const { breakdown, total } = satisfaction;
  
  const maxCount = peakHours && peakHours.length > 0 
    ? Math.max(...peakHours.map(p => p.count)) 
    : 1;

  const getIssueCount = () => {
    return total || 0;
  };

  return (
    <div className="screen pb-20">
      <div className="screen-header">
        <h2 className="screen-title">Analytics report</h2>
      </div>

      {/* 1. Seat Occupancy Section */}
      <div className="flex-row" style={{ display: 'flex', justifyContent: 'space-around' }}>
        <DonutStat 
          percent={Math.round((seatOccupancy.available / seatOccupancy.total) * 100)} 
          label="Available" 
          color="#539546" 
          value={seatOccupancy.available} 
        />
        <DonutStat 
          percent={Math.round((seatOccupancy.occupied / seatOccupancy.total) * 100)} 
          label="Occupied" 
          color="#E74C3C" 
          value={seatOccupancy.occupied} 
        />
        <DonutStat 
          percent={Math.round((seatOccupancy.blocked / seatOccupancy.total) * 100)} 
          label="Blocked" 
          color="#A0AAC2" 
          value={seatOccupancy.blocked} 
        />
      </div>

      {/* 2. Periodic Reservation Statistics Dashboard Section */}
      <div className="card mt-16">
        <p style={{ fontWeight: 600, marginBottom: 16 }}>Total Reservations</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>{reservationStats?.today || 0}</p>
            <p className="text-muted" style={{ fontSize: '12px', marginTop: 4 }}>Today</p>
          </div>
          <div>
            <p style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>{reservationStats?.week || 0}</p>
            <p className="text-muted" style={{ fontSize: '12px', marginTop: 4 }}>This Week</p>
          </div>
          <div>
            <p style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>{reservationStats?.month || 0}</p>
            <p className="text-muted" style={{ fontSize: '12px', marginTop: 4 }}>This Month</p>
          </div>
        </div>
      </div>

      {/* 3. Peak Hours Visualizer Card */}
      <div className="card mt-16">
        <p style={{ fontWeight: 600, marginBottom: 60 }}>Peak Booking Hours (Last 30 Days)</p>
        
        {!peakHours || peakHours.length === 0 ? (
          <p className="text-muted text-center py-4">No hourly data tracked yet.</p>
        ) : (
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-end', 
              height: '140px', 
              paddingTop: '20px',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            {[...peakHours]
              .sort((a, b) => a.hour - b.hour)
              .map((item) => {
                const barHeight = `${Math.min(Math.max((item.count / maxCount) * 100, 8), 100)}%`;
                const displayHour = item.hour >= 12 
                  ? `${item.hour === 12 ? 12 : item.hour - 12}pm` 
                  : `${item.hour}am`;
                console.log(`Hour: ${item.hour}, Count: ${item.count}, Max: ${maxCount}, Height: ${barHeight}`);
                return (
                  <div key={item.hour} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-primary)', fontWeight: '600', marginBottom: '4px' }}>
                      {item.count}
                    </span>
                    <div style={{ width: '65%', height: barHeight, backgroundColor: '#4095F6', borderRadius: '4px 4px 0 0', transition: 'height 0.3s ease', minHeight: '8px', flexShrink: 0 }} title={`${item.count} reservations at ${displayHour}`} />
                    <span className="text-muted" style={{ fontSize: '10px', marginTop: '8px', whiteSpace: 'nowrap' }}>
                      {displayHour}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* 4. User Feedback Section */}
      <div className="card mt-16">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontWeight: 600, margin: 0 }}>User Feedback</p>
          <Link to="/manager/feedback/management-issues" style={{ color: '#4095F6', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            View feedback
          </Link>
        </div>

        {getIssueCount() === 0 ? (
          <p className="text-muted mt-16">No feedback submitted yet.</p>
        ) : (
          <div className="flex-between mt-8" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-muted">Total feedback </span>
            <span style={{ fontWeight: 700 }}>{getIssueCount()}</span>
          </div>
        )}
      </div>

      {/* Only one clean BottomNav component at the footer base */}
      <BottomNav />
    </div>
  );
}