import React, { useState } from 'react';
import type { SocialProgram } from '../api/socialProgramAPI';
import './ProgramList.css';

interface ProgramListProps {
  programs: SocialProgram[];
  onDelete: (id: number) => Promise<void>;
}

export const ProgramList: React.FC<ProgramListProps> = ({ programs, onDelete }) => {
  const [filteredPrograms, setFilteredPrograms] = useState<SocialProgram[]>(programs);
  const [isVisible, setIsVisible] = useState(false);
  const [interests, setInterests] = useState('');

  // Keep filteredPrograms in sync if parent programs change
  React.useEffect(() => {
    setFilteredPrograms(programs);
  }, [programs]);

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

const handleFilter = () => {
  const trimmedInterest = interests.trim().toLowerCase();

  if (!trimmedInterest) {
    // If input is empty, show all programs
    setFilteredPrograms(programs);
    return;
  }

  const filtered = programs.filter(p =>
    p.description.toLowerCase().includes(trimmedInterest) ||
    p.address.toLowerCase().includes(trimmedInterest)
  );
  setFilteredPrograms(filtered);
};


  return (
    <div className="program-list-container">
      <h2 onClick={toggleVisibility} style={{ cursor: 'pointer' }}>
        <span>{isVisible ? '▼' : '▶'}</span> All Social Programs
      </h2>

    {isVisible && (
      <form
        className="program-filter"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page reload
          handleFilter();      // Trigger your filter function
        }}
      >
    <input
      type="text"
      value={interests}
      onChange={e => {
        setInterests(e.target.value);
        handleFilter(); // filter dynamically
      }}
  placeholder="Filter by interests or keywords"
/>
    </form>
  )}

      {isVisible && (
        <ul className={`program-list ${isVisible ? 'visible' : 'hidden'}`}>
          {filteredPrograms.map(p => (
            <li key={p.id} className="program-item">
              <div className="program-item-top">
                <span className="program-address">{p.address}</span>
                <button className="delete-button" onClick={() => onDelete(p.id)}>Delete</button>
              </div>
              <div className="program-description">
                <strong>Description:</strong> {p.description}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
