import React, { useState, useEffect, useRef } from 'react';

interface GoalFormProps {
  onSubmit: (title: string, description: string, totalHours: number) => void;
}

// Goal templates with suggested hours
interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  hours: number;
  category: string;
  keywords: string[];
}

const GOAL_TEMPLATES: GoalTemplate[] = [
  // Languages - Category I: 24-30 weeks (960-1200 hours)
  { id: 'lang-danish', title: 'Learn Danish', description: 'Achieve conversational fluency in Danish', hours: 960, category: 'Language Learning', keywords: ['danish', 'language', 'denmark'] },
  { id: 'lang-dutch', title: 'Learn Dutch', description: 'Achieve conversational fluency in Dutch', hours: 960, category: 'Language Learning', keywords: ['dutch', 'language', 'netherlands'] },
  { id: 'lang-french', title: 'Learn French', description: 'Achieve conversational fluency in French', hours: 1200, category: 'Language Learning', keywords: ['french', 'language', 'france'] },
  { id: 'lang-italian', title: 'Learn Italian', description: 'Achieve conversational fluency in Italian', hours: 960, category: 'Language Learning', keywords: ['italian', 'language', 'italy'] },
  { id: 'lang-norwegian', title: 'Learn Norwegian', description: 'Achieve conversational fluency in Norwegian', hours: 960, category: 'Language Learning', keywords: ['norwegian', 'language', 'norway'] },
  { id: 'lang-portuguese', title: 'Learn Portuguese', description: 'Achieve conversational fluency in Portuguese', hours: 960, category: 'Language Learning', keywords: ['portuguese', 'language', 'brazil', 'portugal'] },
  { id: 'lang-romanian', title: 'Learn Romanian', description: 'Achieve conversational fluency in Romanian', hours: 960, category: 'Language Learning', keywords: ['romanian', 'language', 'romania'] },
  { id: 'lang-spanish', title: 'Learn Spanish', description: 'Achieve conversational fluency in Spanish', hours: 1200, category: 'Language Learning', keywords: ['spanish', 'language', 'spain'] },
  { id: 'lang-swedish', title: 'Learn Swedish', description: 'Achieve conversational fluency in Swedish', hours: 960, category: 'Language Learning', keywords: ['swedish', 'language', 'sweden'] },

  // Languages - Category II: 36 weeks (1440 hours)
  { id: 'lang-german', title: 'Learn German', description: 'Achieve conversational fluency in German', hours: 1440, category: 'Language Learning', keywords: ['german', 'language', 'germany'] },
  { id: 'lang-haitian-creole', title: 'Learn Haitian Creole', description: 'Achieve conversational fluency in Haitian Creole', hours: 1440, category: 'Language Learning', keywords: ['haitian', 'creole', 'language', 'haiti'] },
  { id: 'lang-indonesian', title: 'Learn Indonesian', description: 'Achieve conversational fluency in Indonesian', hours: 1440, category: 'Language Learning', keywords: ['indonesian', 'language', 'indonesia'] },
  { id: 'lang-malay', title: 'Learn Malay', description: 'Achieve conversational fluency in Malay', hours: 1440, category: 'Language Learning', keywords: ['malay', 'language', 'malaysia'] },
  { id: 'lang-swahili', title: 'Learn Swahili', description: 'Achieve conversational fluency in Swahili', hours: 1440, category: 'Language Learning', keywords: ['swahili', 'language', 'africa', 'kenya', 'tanzania'] },

  // Languages - Category III: 44 weeks (1760 hours)
  { id: 'lang-albanian', title: 'Learn Albanian', description: 'Achieve conversational fluency in Albanian', hours: 1760, category: 'Language Learning', keywords: ['albanian', 'language', 'albania'] },
  { id: 'lang-amharic', title: 'Learn Amharic', description: 'Achieve conversational fluency in Amharic', hours: 1760, category: 'Language Learning', keywords: ['amharic', 'language', 'ethiopia'] },
  { id: 'lang-armenian', title: 'Learn Armenian', description: 'Achieve conversational fluency in Armenian', hours: 1760, category: 'Language Learning', keywords: ['armenian', 'language', 'armenia'] },
  { id: 'lang-azerbaijani', title: 'Learn Azerbaijani', description: 'Achieve conversational fluency in Azerbaijani', hours: 1760, category: 'Language Learning', keywords: ['azerbaijani', 'language', 'azerbaijan'] },
  { id: 'lang-bengali', title: 'Learn Bengali', description: 'Achieve conversational fluency in Bengali', hours: 1760, category: 'Language Learning', keywords: ['bengali', 'language', 'bangladesh', 'india'] },
  { id: 'lang-bulgarian', title: 'Learn Bulgarian', description: 'Achieve conversational fluency in Bulgarian', hours: 1760, category: 'Language Learning', keywords: ['bulgarian', 'language', 'bulgaria'] },
  { id: 'lang-burmese', title: 'Learn Burmese', description: 'Achieve conversational fluency in Burmese', hours: 1760, category: 'Language Learning', keywords: ['burmese', 'language', 'myanmar', 'burma'] },
  { id: 'lang-czech', title: 'Learn Czech', description: 'Achieve conversational fluency in Czech', hours: 1760, category: 'Language Learning', keywords: ['czech', 'language', 'czechia', 'czech republic'] },
  { id: 'lang-dari', title: 'Learn Dari', description: 'Achieve conversational fluency in Dari', hours: 1760, category: 'Language Learning', keywords: ['dari', 'language', 'afghanistan'] },
  { id: 'lang-estonian', title: 'Learn Estonian', description: 'Achieve conversational fluency in Estonian', hours: 1760, category: 'Language Learning', keywords: ['estonian', 'language', 'estonia'] },
  { id: 'lang-farsi', title: 'Learn Farsi', description: 'Achieve conversational fluency in Farsi (Persian)', hours: 1760, category: 'Language Learning', keywords: ['farsi', 'persian', 'language', 'iran'] },
  { id: 'lang-finnish', title: 'Learn Finnish', description: 'Achieve conversational fluency in Finnish', hours: 1760, category: 'Language Learning', keywords: ['finnish', 'language', 'finland'] },
  { id: 'lang-georgian', title: 'Learn Georgian', description: 'Achieve conversational fluency in Georgian', hours: 1760, category: 'Language Learning', keywords: ['georgian', 'language', 'georgia'] },
  { id: 'lang-greek', title: 'Learn Greek', description: 'Achieve conversational fluency in Greek', hours: 1760, category: 'Language Learning', keywords: ['greek', 'language', 'greece'] },
  { id: 'lang-hebrew', title: 'Learn Hebrew', description: 'Achieve conversational fluency in Hebrew', hours: 1760, category: 'Language Learning', keywords: ['hebrew', 'language', 'israel'] },
  { id: 'lang-hindi', title: 'Learn Hindi', description: 'Achieve conversational fluency in Hindi', hours: 1760, category: 'Language Learning', keywords: ['hindi', 'language', 'india'] },
  { id: 'lang-hungarian', title: 'Learn Hungarian', description: 'Achieve conversational fluency in Hungarian', hours: 1760, category: 'Language Learning', keywords: ['hungarian', 'language', 'hungary'] },
  { id: 'lang-icelandic', title: 'Learn Icelandic', description: 'Achieve conversational fluency in Icelandic', hours: 1760, category: 'Language Learning', keywords: ['icelandic', 'language', 'iceland'] },
  { id: 'lang-kazakh', title: 'Learn Kazakh', description: 'Achieve conversational fluency in Kazakh', hours: 1760, category: 'Language Learning', keywords: ['kazakh', 'language', 'kazakhstan'] },
  { id: 'lang-khmer', title: 'Learn Khmer', description: 'Achieve conversational fluency in Khmer', hours: 1760, category: 'Language Learning', keywords: ['khmer', 'language', 'cambodia'] },
  { id: 'lang-kurdish', title: 'Learn Kurdish', description: 'Achieve conversational fluency in Kurdish', hours: 1760, category: 'Language Learning', keywords: ['kurdish', 'language', 'kurdistan'] },
  { id: 'lang-kyrgyz', title: 'Learn Kyrgyz', description: 'Achieve conversational fluency in Kyrgyz', hours: 1760, category: 'Language Learning', keywords: ['kyrgyz', 'language', 'kyrgyzstan'] },
  { id: 'lang-lao', title: 'Learn Lao', description: 'Achieve conversational fluency in Lao', hours: 1760, category: 'Language Learning', keywords: ['lao', 'language', 'laos'] },
  { id: 'lang-latvian', title: 'Learn Latvian', description: 'Achieve conversational fluency in Latvian', hours: 1760, category: 'Language Learning', keywords: ['latvian', 'language', 'latvia'] },
  { id: 'lang-lithuanian', title: 'Learn Lithuanian', description: 'Achieve conversational fluency in Lithuanian', hours: 1760, category: 'Language Learning', keywords: ['lithuanian', 'language', 'lithuania'] },
  { id: 'lang-macedonian', title: 'Learn Macedonian', description: 'Achieve conversational fluency in Macedonian', hours: 1760, category: 'Language Learning', keywords: ['macedonian', 'language', 'macedonia'] },
  { id: 'lang-mongolian', title: 'Learn Mongolian', description: 'Achieve conversational fluency in Mongolian', hours: 1760, category: 'Language Learning', keywords: ['mongolian', 'language', 'mongolia'] },
  { id: 'lang-nepali', title: 'Learn Nepali', description: 'Achieve conversational fluency in Nepali', hours: 1760, category: 'Language Learning', keywords: ['nepali', 'language', 'nepal'] },
  { id: 'lang-polish', title: 'Learn Polish', description: 'Achieve conversational fluency in Polish', hours: 1760, category: 'Language Learning', keywords: ['polish', 'language', 'poland'] },
  { id: 'lang-russian', title: 'Learn Russian', description: 'Achieve conversational fluency in Russian', hours: 1760, category: 'Language Learning', keywords: ['russian', 'language', 'russia'] },
  { id: 'lang-serbo-croatian', title: 'Learn Serbo-Croatian', description: 'Achieve conversational fluency in Serbo-Croatian', hours: 1760, category: 'Language Learning', keywords: ['serbo-croatian', 'serbian', 'croatian', 'language', 'serbia', 'croatia'] },
  { id: 'lang-sinhala', title: 'Learn Sinhala', description: 'Achieve conversational fluency in Sinhala', hours: 1760, category: 'Language Learning', keywords: ['sinhala', 'language', 'sri lanka'] },
  { id: 'lang-slovak', title: 'Learn Slovak', description: 'Achieve conversational fluency in Slovak', hours: 1760, category: 'Language Learning', keywords: ['slovak', 'language', 'slovakia'] },
  { id: 'lang-slovenian', title: 'Learn Slovenian', description: 'Achieve conversational fluency in Slovenian', hours: 1760, category: 'Language Learning', keywords: ['slovenian', 'language', 'slovenia'] },
  { id: 'lang-somali', title: 'Learn Somali', description: 'Achieve conversational fluency in Somali', hours: 1760, category: 'Language Learning', keywords: ['somali', 'language', 'somalia'] },
  { id: 'lang-tagalog', title: 'Learn Tagalog', description: 'Achieve conversational fluency in Tagalog', hours: 1760, category: 'Language Learning', keywords: ['tagalog', 'language', 'philippines'] },
  { id: 'lang-tajiki', title: 'Learn Tajiki', description: 'Achieve conversational fluency in Tajiki', hours: 1760, category: 'Language Learning', keywords: ['tajiki', 'language', 'tajikistan'] },
  { id: 'lang-tamil', title: 'Learn Tamil', description: 'Achieve conversational fluency in Tamil', hours: 1760, category: 'Language Learning', keywords: ['tamil', 'language', 'india', 'sri lanka'] },
  { id: 'lang-telugu', title: 'Learn Telugu', description: 'Achieve conversational fluency in Telugu', hours: 1760, category: 'Language Learning', keywords: ['telugu', 'language', 'india'] },
  { id: 'lang-thai', title: 'Learn Thai', description: 'Achieve conversational fluency in Thai', hours: 1760, category: 'Language Learning', keywords: ['thai', 'language', 'thailand'] },
  { id: 'lang-tibetan', title: 'Learn Tibetan', description: 'Achieve conversational fluency in Tibetan', hours: 1760, category: 'Language Learning', keywords: ['tibetan', 'language', 'tibet'] },
  { id: 'lang-turkish', title: 'Learn Turkish', description: 'Achieve conversational fluency in Turkish', hours: 1760, category: 'Language Learning', keywords: ['turkish', 'language', 'turkey'] },
  { id: 'lang-turkmen', title: 'Learn Turkmen', description: 'Achieve conversational fluency in Turkmen', hours: 1760, category: 'Language Learning', keywords: ['turkmen', 'language', 'turkmenistan'] },
  { id: 'lang-ukrainian', title: 'Learn Ukrainian', description: 'Achieve conversational fluency in Ukrainian', hours: 1760, category: 'Language Learning', keywords: ['ukrainian', 'language', 'ukraine'] },
  { id: 'lang-urdu', title: 'Learn Urdu', description: 'Achieve conversational fluency in Urdu', hours: 1760, category: 'Language Learning', keywords: ['urdu', 'language', 'pakistan', 'india'] },
  { id: 'lang-uzbek', title: 'Learn Uzbek', description: 'Achieve conversational fluency in Uzbek', hours: 1760, category: 'Language Learning', keywords: ['uzbek', 'language', 'uzbekistan'] },
  { id: 'lang-vietnamese', title: 'Learn Vietnamese', description: 'Achieve conversational fluency in Vietnamese', hours: 1760, category: 'Language Learning', keywords: ['vietnamese', 'language', 'vietnam'] },

  // Languages - Category IV: 88 weeks (3520 hours)
  { id: 'lang-arabic', title: 'Learn Arabic', description: 'Achieve conversational fluency in Arabic', hours: 3520, category: 'Language Learning', keywords: ['arabic', 'language'] },
  { id: 'lang-cantonese', title: 'Learn Chinese (Cantonese)', description: 'Achieve conversational fluency in Cantonese Chinese', hours: 3520, category: 'Language Learning', keywords: ['cantonese', 'chinese', 'language', 'china', 'hong kong'] },
  { id: 'lang-mandarin', title: 'Learn Chinese (Mandarin)', description: 'Achieve conversational fluency in Mandarin Chinese', hours: 3520, category: 'Language Learning', keywords: ['mandarin', 'chinese', 'language', 'china'] },
  { id: 'lang-japanese', title: 'Learn Japanese', description: 'Achieve conversational fluency in Japanese', hours: 3520, category: 'Language Learning', keywords: ['japanese', 'language', 'japan'] },
  { id: 'lang-korean', title: 'Learn Korean', description: 'Achieve conversational fluency in Korean', hours: 3520, category: 'Language Learning', keywords: ['korean', 'language', 'korea'] },

  // Programming & Tech
  { id: 'prog-react', title: 'Master React Development', description: 'Become proficient in React and modern frontend development', hours: 200, category: 'Programming', keywords: ['react', 'javascript', 'frontend', 'web development', 'programming'] },
  { id: 'prog-python', title: 'Learn Python Programming', description: 'Master Python for data science and web development', hours: 150, category: 'Programming', keywords: ['python', 'programming', 'data science', 'backend'] },
  { id: 'prog-typescript', title: 'Master TypeScript', description: 'Become proficient in TypeScript for large-scale applications', hours: 100, category: 'Programming', keywords: ['typescript', 'javascript', 'programming'] },
  { id: 'prog-nodejs', title: 'Learn Node.js', description: 'Master backend development with Node.js', hours: 120, category: 'Programming', keywords: ['nodejs', 'node', 'javascript', 'backend', 'programming'] },

  // Music & Arts
  { id: 'music-piano', title: 'Learn Piano', description: 'Achieve intermediate piano playing skills', hours: 500, category: 'Music', keywords: ['piano', 'music', 'instrument'] },
  { id: 'guitar-beginner', title: 'Learn Guitar (Beginner)', description: 'Basic understanding of fundamentals. Know several notes and chords and even a few beginner level songs. Basic strumming and rhythm ability.', hours: 300, category: 'Music', keywords: ['guitar', 'music', 'instrument', 'beginner'] },
  { id: 'guitar-intermediate', title: 'Learn Guitar (Intermediate)', description: 'Able to grasp concepts of key signatures, scales, strumming techniques, and song structure. Have an expanded catalog of chords, scales, riffs, and songs in your repertoire.', hours: 1000, category: 'Music', keywords: ['guitar', 'music', 'instrument', 'intermediate'] },
  { id: 'guitar-advanced', title: 'Learn Guitar (Advanced)', description: 'Expert understanding of key, tempo, tone, dynamics, etc. Be able to play a wide catalog of songs and riffs. Have an ability to improvise on songs you know and begin to write your own songs and riffs.', hours: 3250, category: 'Music', keywords: ['guitar', 'music', 'instrument', 'advanced'] },
  { id: 'guitar-professional', title: 'Learn Guitar (Professional)', description: 'Able to effectively play with other capable musicians. Easily able to learn on the fly and play new material with minimal preparation time. Expert improvising skills and ability to compose material. Possess knowledge and ability to begin teaching the guitar to beginner players.', hours: 5000, category: 'Music', keywords: ['guitar', 'music', 'instrument', 'professional', 'expert'] },
  { id: 'art-drawing', title: 'Master Drawing', description: 'Develop advanced drawing and sketching skills', hours: 300, category: 'Art', keywords: ['drawing', 'art', 'sketch', 'illustration'] },

  // Fitness & Health
  { id: 'fitness-marathon', title: 'Train for Marathon', description: 'Complete marathon training program', hours: 300, category: 'Fitness', keywords: ['marathon', 'running', 'fitness', 'training'] },
  { id: 'fitness-strength', title: 'Strength Training Program', description: 'Build strength and muscle through consistent training', hours: 200, category: 'Fitness', keywords: ['strength', 'fitness', 'gym', 'weightlifting'] },

  // Professional Skills
  { id: 'prof-public-speaking', title: 'Master Public Speaking', description: 'Develop confident public speaking and presentation skills', hours: 100, category: 'Professional Skills', keywords: ['public speaking', 'presentation', 'communication'] },
  { id: 'prof-leadership', title: 'Develop Leadership Skills', description: 'Build effective leadership and management capabilities', hours: 150, category: 'Professional Skills', keywords: ['leadership', 'management', 'professional'] }
];

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTemplates, setFilteredTemplates] = useState<GoalTemplate[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter templates based on title input
  useEffect(() => {
    if (title.length < 2) {
      setFilteredTemplates([]);
      setShowSuggestions(false);
      return;
    }

    const titleLower = title.toLowerCase();
    const matches = GOAL_TEMPLATES.filter(template =>
      template.title.toLowerCase().includes(titleLower) ||
      template.keywords.some(keyword => keyword.toLowerCase().includes(titleLower))
    ).slice(0, 6); // Limit to 6 suggestions

    setFilteredTemplates(matches);
    setShowSuggestions(matches.length > 0);
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
      onSubmit(title.trim(), description.trim(), hours);
      setTitle('');
      setDescription('');
      setTotalHours('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ position: 'relative' }}>
        <input
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
                onClick={() => selectTemplate(template)}
                data-testid={`suggestion-${template.id}`}
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  backgroundColor: index === selectedIndex ? '#f0f0f0' : 'white',
                  borderBottom: index < filteredTemplates.length - 1 ? '1px solid #eee' : 'none'
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{template.title}</div>
                <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '4px' }}>
                  {template.description}
                </div>
                <div style={{ fontSize: '0.8em', color: '#888' }}>
                  {template.hours} hours • {template.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <textarea
          placeholder="Goal description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          data-testid="goal-description-input"
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
          data-testid="goal-hours-input"
        />
      </div>
      <button type="submit" disabled={!title.trim() || !totalHours || parseFloat(totalHours) <= 0}>
        Add Goal
      </button>
    </form>
  );
};