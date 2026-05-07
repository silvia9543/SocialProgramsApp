import { useEffect, useState } from 'react';
import { socialProgramAPI } from '../api/socialProgramAPI';
import type { SocialProgram } from '../api/socialProgramAPI';
import './ProgramSearch.css';

export const ProgramSearch = () => {
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState(1);

  const [results, setResults] = useState<SocialProgram[]>([]);
  const [filteredResults, setFilteredResults] = useState<SocialProgram[]>([]);
  const [keyword, setKeyword] = useState('');

  const handleSearch = async () => {
    if (!address || distance <= 0) {
      alert('Please enter a valid address and distance.');
      return;
    }

    const data = await socialProgramAPI.findNearby(address, distance);
    setResults(data);
    setFilteredResults(data);
    setKeyword('');
  };

  // Reset results when address is cleared
  useEffect(() => {
    if (!address.trim()) {
      setResults([]);
      setFilteredResults([]);
      setKeyword('');
    }
  }, [address]);

  // Filter by keyword
  useEffect(() => {
    if (!keyword.trim()) {
      setFilteredResults(results);
      return;
    }

    const lower = keyword.toLowerCase();
    setFilteredResults(
      results.filter(p =>
        p.description?.toLowerCase().includes(lower)
      )
    );
  }, [keyword, results]);

  return (
    <div className="program-search-container">
      <h2>Find Nearby Programs</h2>

      <div className="program-search-form">
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Your address"
          className="program-input"
        />

        <div className="program-distance">
          <label htmlFor="distance">Distance: {distance} miles</label>
          <input
            id="distance"
            type="range"
            min={0}
            max={10}
            step={0.1}
            value={distance}
            onChange={e => setDistance(parseFloat(e.target.value))}
            className="program-slider"
          />
        </div>

        <button className="program-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Keyword Filter */}
      {results.length > 0 && (
        <div className="program-filter">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Filter results by keywords (e.g. food, housing, youth)"
            className="program-input"
          />
        </div>
      )}

      {filteredResults.length > 0 && (
        <ul className="search-results">
          {filteredResults.map(p => (
            <li key={p.id} className="search-result-card">
              <div className="card-header">
                <span>{p.address}</span>
              </div>
              <div className="card-body">
                <strong>Description:</strong> {p.description}
              </div>
            </li>
          ))}
        </ul>
      )}

      {results.length > 0 && filteredResults.length === 0 && (
        <p style={{ marginTop: '1rem', color: '#777' }}>
          No programs match that keyword.
        </p>
      )}
    </div>
  );
};
