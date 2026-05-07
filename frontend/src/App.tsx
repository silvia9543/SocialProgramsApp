import { useEffect, useState } from 'react';
import { socialProgramAPI } from './api/socialProgramAPI';
import { ProgramList } from './components/ProgramList';
import { ProgramForm } from './components/ProgramForm';
import { ProgramSearch } from './components/ProgramSearch';
import { ChatBox } from './components/ChatBox'; // <-- New chat component
import './App.css';

const App = () => {
  const [, setAllPrograms] = useState<any[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(false);

  const fetchPrograms = async () => {
    const data = await socialProgramAPI.getAll();
    setAllPrograms(data);
    setFilteredPrograms(data);
  };

  useEffect(() => {
    fetchPrograms();
  }, [refresh]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Find Social Programs</h1>
      </header>

      <div className="app-body" style={{ display: 'flex', gap: '1rem' }}>
        {/* Sidebar */}
        <aside className="app-sidebar">
          <h3>Actions</h3>
          <p>Search for Nearby Programs</p>
          <p>View All Programs</p>
          <p>Add a New Program</p>

          <h3 style={{ marginTop: '2rem' }}>About</h3>
          <p>This tool helps users find social programs within a certain mile radius of their location. Users can also ask the chatbot below any 
            questions about social programs, such as "How can I apply for food assistance?"
          </p>
          <p>Users can contribute by adding new programs with address and description.</p>

          {/* Chatbox placeholder */}
          <h3 style={{ marginTop: '2rem' }}>Ask about Social Programs</h3>
          <ChatBox />
        </aside>

        <main className="app-main" style={{ flex: 1 }}>
          <ProgramSearch />
          <ProgramForm onAdded={() => setRefresh(prev => !prev)} />
          <ProgramList
            programs={filteredPrograms}
            onDelete={async (id) => {
              await socialProgramAPI.delete(id);
              setRefresh(prev => !prev); // refresh after delete
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
