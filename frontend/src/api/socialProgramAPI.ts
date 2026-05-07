const BASE_URL = 'http://localhost:8080/v1/api';

export interface SocialProgram {
  id: number;
  address: string;
  cellId: string;
  description: string;
}

export interface ProgramRequest {
  address: string;
  distance?: number;
}

export const socialProgramAPI = {
  getAll: async (): Promise<SocialProgram[]> => {
    const res = await fetch(`${BASE_URL}/getAllAddresses`);
    if (!res.ok) throw new Error('Failed to fetch programs');
    return res.json();
  },

  create: async ({address, description}: {address: string, description: string}): Promise<SocialProgram> => {
    const res = await fetch(`${BASE_URL}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, description}),
    });
    if (!res.ok) throw new Error('Failed to add program');
    return res.json();
  },

  update: async (program: SocialProgram): Promise<SocialProgram> => {
    const res = await fetch(`${BASE_URL}/addresses/${program.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(program),
    });
    if (!res.ok) throw new Error('Failed to update program');
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/addresses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete program');
  },

  findNearby: async (address: string, distance: number): Promise<SocialProgram[]> => {
    const res = await fetch(`${BASE_URL}/findAddresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, distance }),
    });
    if (!res.ok) throw new Error('Failed to find nearby programs');
    return res.json();
  },
};
