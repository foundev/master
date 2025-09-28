import React, { useState } from 'react';
import { Modal } from './Modal';
import { TimeSession } from '../types';
import { validateDailyTimeLimit } from '../utils/time';
import { storage } from '../utils/storage';

interface AddTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalTitle: string;
  onAddTime: (hours: number, date?: Date) => void;
}

export const AddTimeModal: React.FC<AddTimeModalProps> = ({
  isOpen,
  onClose,
  goalTitle,
  onAddTime
}) => {
  const [manualHours, setManualHours] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const hours = parseFloat(manualHours);
    if (isNaN(hours) || hours <= 0) {
      setValidationError('Please enter a valid number of hours greater than 0');
      return;
    }

    const targetDate = manualDate ? new Date(manualDate) : new Date();
    // Get ALL sessions from storage for accurate validation across all projects and dates
    const allSessions = storage.getSessions();
    const validation = validateDailyTimeLimit(allSessions, hours, targetDate);

    if (!validation.isValid) {
      setValidationError(validation.message || 'Time limit exceeded');
      return;
    }

    onAddTime(hours, manualDate ? new Date(manualDate) : undefined);
    setManualHours('');
    setManualDate('');
    setValidationError(null);
    onClose();
  };

  const handleClose = () => {
    setManualHours('');
    setManualDate('');
    setValidationError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Add Time: ${goalTitle}`}
    >
      <form onSubmit={handleSubmit}>
        {validationError && (
          <>
            <style>
              {`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  25% { transform: translateX(-5px); }
                  75% { transform: translateX(5px); }
                }
              `}
            </style>
            <div style={{
              color: '#d32f2f',
              marginBottom: '1rem',
              padding: '1rem',
              border: '2px solid #f44336',
              borderRadius: '8px',
              backgroundColor: '#ffebee',
              fontSize: '0.95rem',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(244, 67, 54, 0.1)',
              animation: 'shake 0.5s ease-in-out'
            }}>
              <strong>⚠️ Daily Time Limit Exceeded</strong><br />
              {validationError}
            </div>
          </>
        )}

        <div>
          <label htmlFor="hours">Hours to add:</label>
          <input
            id="hours"
            type="number"
            placeholder="Hours to add"
            value={manualHours}
            onChange={(e) => setManualHours(e.target.value)}
            min="0.1"
            max="24"
            step="0.1"
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="date">Date (optional):</label>
          <input
            id="date"
            type="date"
            placeholder="Date (optional)"
            value={manualDate}
            onChange={(e) => setManualDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          <small>Leave empty to use today's date</small>
        </div>

        <footer>
          <button
            type="button"
            onClick={handleClose}
            className="secondary"
          >
            Cancel
          </button>
          <button
            id="submit-time-button"
            type="submit"
            disabled={!manualHours || parseFloat(manualHours) <= 0}
          >
            Add Time
          </button>
        </footer>
      </form>
    </Modal>
  );
};