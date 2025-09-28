import React, { useState } from 'react';
import { Modal } from './Modal';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(manualHours);
    if (!isNaN(hours) && hours > 0) {
      const selectedDate = manualDate ? new Date(manualDate) : undefined;
      onAddTime(hours, selectedDate);
      setManualHours('');
      setManualDate('');
      onClose();
    }
  };

  const handleClose = () => {
    setManualHours('');
    setManualDate('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Add Time: ${goalTitle}`}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="hours">Hours to add:</label>
          <input
            id="hours"
            type="number"
            placeholder="e.g., 2.5"
            value={manualHours}
            onChange={(e) => setManualHours(e.target.value)}
            min="0.1"
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