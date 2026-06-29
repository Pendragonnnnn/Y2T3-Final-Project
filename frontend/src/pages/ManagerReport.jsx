import { useEffect, useState } from 'react';
import api from '../services/api';
import BottomNav from '../components/BottomNav';

const SENTIMENT_COLORS = {
  bug: '#E74C3C',
  feature_request: '#4095F6',
  management_issue: '#F5A623',
  general: '#A0AAC2',
};

function DonutStat({ percent, label, color }) {
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
          {percent}%
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
    api.get('/manager/report').then(({ data }) => setReport(data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="screen">
        <div className="text-center mt-24"><div className="spinner" style={{ margin: '0 auto' }} /></div>
        <BottomNav />
      </div>
    );
  }

  const { seatOccupancy, satisfaction } = report;
  const { breakdown, total, avgRating } = satisfaction;

  const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Analytics report</h2>
      </div>

      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 12 }}>Seat occupancy</p>
        <div className="flex-row" style={{ justifyContent: 'space-around' }}>
          <DonutStat percent={Math.round((seatOccupancy.occupied / seatOccupancy.total) * 100)} label="Occupied" color="#E74C3C" />
          <DonutStat percent={Math.round((seatOccupancy.available / seatOccupancy.total) * 100)} label="Available" color="#2ECC71" />
          <DonutStat percent={Math.round((seatOccupancy.blocked / seatOccupancy.total) * 100)} label="Blocked" color="#A0AAC2" />
        </div>
      </div>

      <div className="card mt-16">
        <div className="flex-between">
          <p style={{ fontWeight: 600 }}>Feedback breakdown</p>
          <span className="text-muted" style={{ fontSize: 12 }}>via Logistic Regression</span>
        </div>

        {total === 0 ? (
          <p className="text-muted mt-16">No feedback submitted yet.</p>
        ) : (
          <>
            <div
              className="mt-16"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                rowGap: 20,
                justifyItems: 'center',
              }}
            >
              <DonutStat percent={pct(breakdown.bug)} label="Bug reports" color={SENTIMENT_COLORS.bug} />
              <DonutStat percent={pct(breakdown.feature_request)} label="Feature requests" color={SENTIMENT_COLORS.feature_request} />
              <DonutStat percent={pct(breakdown.management_issue)} label="Management issues" color={SENTIMENT_COLORS.management_issue} />
              <DonutStat percent={pct(breakdown.general)} label="General comments" color={SENTIMENT_COLORS.general} />
            </div>
            <div className="flex-between mt-16" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
              <span className="text-muted">Average star rating</span>
              <span style={{ fontWeight: 700 }}>{avgRating} / 5</span>
            </div>
            <div className="flex-between mt-8">
              <span className="text-muted">Total feedback responses</span>
              <span style={{ fontWeight: 700 }}>{total}</span>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}