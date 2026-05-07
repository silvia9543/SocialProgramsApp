import React, { useState } from 'react';
import { socialProgramAPI } from '../api/socialProgramAPI';
import './ProgramForm.css';

export const ProgramForm = ({ onAdded }: { onAdded: () => void }) => {
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !description) {
      alert('Please fill in both address and description.');
      return;
    }
    await socialProgramAPI.create({ address, description });
    setAddress('');
    setDescription('');
    onAdded();
  };

  return (
    <form className="program-form" onSubmit={handleSubmit}>
      <h2> Add a Program </h2>
      <input
        type="text"
        value={address}
        onChange={e => setAddress(e.target.value)}
        placeholder="Program address"
        required
        className="program-input"
      />
      <textarea
      value={description}
      onChange={e => setDescription(e.target.value)}
      placeholder="Program description"
      required
      className="program-textarea"
      rows={4}
    />
      <button type="submit" className="program-button">Add Program</button>
    </form>
  );
};
