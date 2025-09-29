import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (title: string, description: string, totalHours: number) => void;
}

// Goal templates with suggested hours (copied from GoalForm)
interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  hours: number;
  category: string;
  keywords: string[];
}

const goalTemplates: GoalTemplate[] = [
  // Language Learning (FSI Categories)
  { id: 'lang-spanish', title: 'Learn Spanish', description: 'Achieve conversational fluency in Spanish', hours: 600, category: 'Language', keywords: ['spanish', 'language', 'learn', 'speak', 'fluent'] },
  { id: 'lang-french', title: 'Learn French', description: 'Achieve conversational fluency in French', hours: 1200, category: 'Language', keywords: ['french', 'language', 'learn', 'speak', 'fluent'] },
  { id: 'lang-german', title: 'Learn German', description: 'Achieve conversational fluency in German', hours: 1200, category: 'Language', keywords: ['german', 'language', 'learn', 'speak', 'fluent'] },
  { id: 'lang-japanese', title: 'Learn Japanese', description: 'Achieve conversational fluency in Japanese', hours: 3520, category: 'Language', keywords: ['japanese', 'language', 'learn', 'speak', 'fluent'] },
  { id: 'lang-chinese', title: 'Learn Chinese', description: 'Achieve conversational fluency in Mandarin Chinese', hours: 3520, category: 'Language', keywords: ['chinese', 'mandarin', 'language', 'learn', 'speak', 'fluent'] },

  // Programming
  { id: 'prog-react', title: 'Master React Development', description: 'Become proficient in React and modern frontend development', hours: 200, category: 'Programming', keywords: ['react', 'javascript', 'frontend', 'web', 'development', 'programming'] },
  { id: 'prog-python', title: 'Learn Python Programming', description: 'Master Python for data science and web development', hours: 300, category: 'Programming', keywords: ['python', 'programming', 'data', 'science', 'web', 'development'] },
  { id: 'prog-fullstack', title: 'Full-Stack Web Development', description: 'Learn complete web development stack', hours: 500, category: 'Programming', keywords: ['fullstack', 'web', 'development', 'frontend', 'backend', 'programming'] },

  // Skills
  { id: 'skill-piano', title: 'Learn Piano', description: 'Develop piano playing skills from beginner to intermediate', hours: 500, category: 'Music', keywords: ['piano', 'music', 'instrument', 'play', 'learn'] },
  { id: 'skill-guitar', title: 'Learn Guitar', description: 'Master acoustic guitar playing', hours: 300, category: 'Music', keywords: ['guitar', 'music', 'instrument', 'play', 'learn', 'acoustic'] },
  { id: 'skill-drawing', title: 'Learn Drawing', description: 'Develop artistic drawing and sketching skills', hours: 200, category: 'Art', keywords: ['drawing', 'art', 'sketch', 'artistic', 'creative'] },
];

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onAddGoal
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTemplates, setFilteredTemplates] = useState<GoalTemplate[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter templates based on input
  useEffect(() => {
    if (title.length >= 2) {
      const filtered = goalTemplates.filter(template =>
        template.keywords.some(keyword =>
          keyword.toLowerCase().includes(title.toLowerCase())
        ) || template.title.toLowerCase().includes(title.toLowerCase())
      );
      setFilteredTemplates(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredTemplates([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [title]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredTemplates.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredTemplates.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : filteredTemplates.length - 1
        );
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          selectTemplate(filteredTemplates[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Select a template from suggestions
  const selectTemplate = (template: GoalTemplate) => {
    setTitle(template.title);
    setDescription(template.description);
    setTotalHours(template.hours.toString());
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hours = parseFloat(totalHours);
    if (title.trim() && !isNaN(hours) && hours > 0) {
      onAddGoal(title.trim(), description.trim(), hours);
      setTitle('');
      setDescription('');
      setTotalHours('');
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setTotalHours('');
    onClose();
  };

  const isFormValid = title.trim() && totalHours && parseFloat(totalHours) > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Add New Goal"
    >
      <form id="add-goal-form" onSubmit={handleSubmit}>
        <fieldset>

        <label htmlFor="goal-title">
          Goal title:
          <div style={{ position: 'relative' }}>
            <input
              id="goal-title"
              ref={inputRef}
              type="text"
              placeholder="Goal title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => filteredTemplates.length > 0 && setShowSuggestions(true)}
              required
              autoComplete="off"
              data-testid="goal-title-input"
            />
            {showSuggestions && filteredTemplates.length > 0 && (
              <div
                ref={suggestionsRef}
                data-testid="goal-suggestions"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  maxHeight: '250px',
                  overflowY: 'auto'
                }}
              >
                {filteredTemplates.map((template, index) => (
                  <div
                    key={template.id}
                    data-testid={`suggestion-${template.id}`}
                    onClick={() => selectTemplate(template)}
                    style={{
                      padding: '0.75rem',
                      cursor: 'pointer',
                      borderBottom: index < filteredTemplates.length - 1 ? '1px solid #eee' : 'none',
                      backgroundColor: index === selectedIndex ? '#f0f0f0' : 'transparent'
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                      {template.title}
                      {template.description}
                      {template.hours} hours • {template.category}
                  </div>
                ))}
              </div>
            )}
          </div>
        </label>

        <label htmlFor="goal-description">
          Goal description (optional):
          <textarea
            id="goal-description"
            placeholder="Goal description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            data-testid="goal-description-input"
          />
        </label>

        <label htmlFor="goal-hours">
          Total hours required:
          <input
            id="goal-hours"
            type="number"
            placeholder="Total hours required"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            min="0.1"
            step="0.1"
            required
            data-testid="goal-hours-input"
          />
        </label>
        </fieldset>

      </form>
      <footer>
        <div className="grid">
          <button type="button" className="secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" form="add-goal-form" disabled={!isFormValid}>
            Add Goal
          </button>
        </div>
      </footer>
    </Modal>
  );
};
