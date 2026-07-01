import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

const STUDENT_FAQ_DATA = [
  {
    category: 'Reservations',
    icon: '',
    items: [
      {
        q: 'How do I reserve a seat?',
        a: 'Open the seat map from the home screen, tap any green (available) seat, choose your time slot, and confirm. You\'ll receive a notification once it\'s booked.',
      },
      {
        q: 'How far in advance can I book?',
        a: 'You can reserve a seat up to 7 days in advance. Same-day bookings are also available as long as the seat is free.',
      },
      {
        q: 'Can I change my reservation after booking?',
        a: 'Yes — go to your active reservation and tap "Cancel", then make a new booking. Direct editing is not yet supported.',
      },
      {
        q: 'How many active reservations can I have at once?',
        a: 'You can hold one active reservation at a time. Once you check in or your booking expires, you can create a new one.',
      },
    ],
  },
  {
    category: 'Check-in & no-shows',
    icon: '',
    items: [
      {
        q: 'How do I check in?',
        a: 'Arrive at your reserved seat and tap "Check in" on the reservation card on your home screen. Check-in must happen within 15 minutes of your scheduled start time.',
      },
      {
        q: 'What happens if I don\'t check in?',
        a: 'Missing your check-in window counts as a no-show. Your seat is released for others and 10 points are added to your penalty score.',
      },
      {
        q: 'What if I\'m running late?',
        a: 'You have a 15-minute grace period after your scheduled start. If you know you\'ll be late, cancel your booking in advance to avoid a penalty.',
      },
    ],
  },
  {
    category: 'Penalty score',
    icon: '',
    items: [
      {
        q: 'What is the penalty score?',
        a: 'It\'s a number that tracks reliability. Everyone starts at 100. No-shows and late cancellations increase your score; staying in good standing keeps it at 100.',
      },
      {
        q: 'What happens if my score gets too high?',
        a: 'Students with a score above 130 may have their booking privileges temporarily restricted until the score drops back down.',
      },
      {
        q: 'Can my penalty score go down?',
        a: 'Yes — consistent, penalty-free use over time will gradually reduce your score back toward the 100 baseline. Contact a library manager if you believe a penalty was applied in error.',
      },
    ],
  },
  {
    category: 'Account & settings',
    icon: '',
    items: [
      {
        q: 'How do I change my password?',
        a: 'Go to Profile → Change password. Enter your current password and your new password (minimum 6 characters), then tap "Update password".',
      },
      {
        q: 'Can I change my email address?',
        a: 'Email changes are not currently supported in the app. Please contact the library manager to update your account email.',
      },
      {
        q: 'How do I enable dark mode?',
        a: 'Go to Profile and scroll to the Dark mode section. Toggle it on or off — your preference is saved automatically.',
      },
    ],
  },
  {
    category: 'Library policies',
    icon: '',
    items: [
      {
        q: 'Are food and drinks allowed at seats?',
        a: 'Covered drinks are permitted. Food is allowed in designated zones only — please check the seat map labels for "Food OK" areas.',
      },
      {
        q: 'Can I save a seat for a friend?',
        a: 'No. Each seat must be reserved and checked in by the same user. Holding seats without a booking is not allowed.',
      },
      {
        q: 'Who do I contact if there\'s a problem with a seat?',
        a: 'Use the feedback form after your visit, or speak directly to a library staff member. Managers can also block or unblock seats from their dashboard.',
      },
    ],
  },
];

const MANAGER_FAQ_DATA = [
  {
    category: 'Dashboard & Reservations',
    icon: '',
    items: [
      {
        q: 'How do I manage active or pending reservations?',
        a: 'From the Manager Dashboard, you can view all active and pending reservations. For pending reservations, you have the option to manually reject them using the red "Reject" button.',
      },
      {
        q: 'How do I scan a student\'s QR code?',
        a: 'Tap "Scan QR" from the dashboard to access the Scanner Station. Keep the input field focused and point the USB scanner at the student\'s code. It handles both check-ins and check-outs automatically.',
      }
    ]
  },
  {
    category: 'Seat Management',
    icon: '',
    items: [
      {
        q: 'How do I block or open a seat?',
        a: 'Navigate to the Seat Map in Control mode. Tap any seat to pull up the action menu at the bottom of the screen, then toggle "Block seat" or "Open seat". Blocked seats immediately become unavailable for student booking.',
      }
    ]
  },
  {
    category: 'Reports & Students',
    icon: '',
    items: [
      {
        q: 'Where can I see library usage trends?',
        a: 'The Analytics Report displays current seat occupancy, daily/weekly/monthly reservation totals, and a visual breakdown of peak booking hours over the last 30 days.',
      },
      {
        q: 'How do I view user feedback and issues?',
        a: 'User feedback is tracked in the Analytics Report, or you can view specific management issues by clicking "View feedback" to see detailed star ratings and comments left by users.',
      },
      {
        q: 'How do I look up a specific student?',
        a: 'Go to the All Students screen. Use the search bar to look them up by name or email, then tap their profile to view their complete history.',
      }
    ]
  }
];

export default function FAQ() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Pull in the current user to check their role
  const [openKey, setOpenKey] = useState(null); // "catIdx-itemIdx"

  const toggle = (key) => setOpenKey((prev) => (prev === key ? null : key));

  // Swap the displayed FAQ data based on the user's role
  const isManager = user?.role === 'manager'; // Adjust 'manager' to match your exact role string if different
  const activeData = isManager ? MANAGER_FAQ_DATA : STUDENT_FAQ_DATA;

  return (
    <div className="screen">
      <div className="faq-screen-header"> 
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 22,
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            alignSelf: 'flex-start',
            color: '#0B56A4',
          }}
          aria-label="Go back"
        >
          く
        </button>

        <h2 className="screen-title">{isManager ? 'Manager FAQs' : 'FAQs'}</h2>

        <div style={{ width: 22 }} />
      </div>

      {activeData.map((section, catIdx) => (
        <div key={catIdx} style={{ marginBottom: 20 }}>
          {/* Category header */}
          <div className="flex-row" style={{ marginBottom: 10, gap: 8 }}>
            <span style={{ fontSize: 16 }}>{section.icon}</span>
            <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {section.category}
            </p>
          </div>

          {/* Accordion items */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {section.items.map((item, itemIdx) => {
              const key = `${catIdx}-${itemIdx}`;
              const isOpen = openKey === key;
              const isLast = itemIdx === section.items.length - 1;

              return (
                <div
                  key={itemIdx}
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
                  }}
                >
                  {/* Question row */}
                  <button
                    onClick={() => toggle(key)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '14px 16px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: isOpen ? 600 : 500,
                      fontSize: 14,
                      color: isOpen ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      transition: 'color 0.15s ease',
                    }}
                  >
                    <span>{item.q}</span>
                    <span
                      style={{
                        fontSize: 18,
                        color: 'var(--color-text-secondary)',
                        flexShrink: 0,
                        display: 'inline-block',
                        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      ›
                    </span>
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div
                      style={{
                        padding: '0 16px 14px',
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: 'var(--color-text-secondary)',
                        borderTop: '1px solid var(--color-border)',
                        paddingTop: 12,
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Contact footer */}
      <div
        className="card mt-16"
        style={{ textAlign: 'center', background: 'var(--color-primary)', border: 'none' }}
      >
        <p style={{ fontWeight: 600, color: 'white', marginBottom: 4 }}>Still need help?</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
          {isManager 
            ? 'Contact the system administrator for technical support.'
            : 'Speak to a library manager at the front desk or leave feedback after your next visit.'}
        </p>
      </div>

      <BottomNav />
    </div>
  );
}