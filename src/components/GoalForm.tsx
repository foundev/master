import React, { useState } from 'react';

interface GoalFormProps {
  onSubmit: (title: string, description: string, totalHours: number) => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalHours, setTotalHours] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(totalHours);
    if (title.trim() && !isNaN(hours) && hours > 0) {
      onSubmit(title.trim(), description.trim(), hours);
      setTitle('');
      setDescription('');
      setTotalHours('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Goal</h3>
      <div>
        <input
          type="text"
          placeholder="Goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Goal description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="Total hours required"
          value={totalHours}
          onChange={(e) => setTotalHours(e.target.value)}
          min="0.1"
          step="0.1"
          required
        />
      </div>
      <button type="submit" disabled={!title.trim() || !totalHours || parseFloat(totalHours) <= 0}>
        Add Goal
      </button>
    </form>
  );
};