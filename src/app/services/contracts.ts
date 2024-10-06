export async function fetchContract(id: string | null) {
    const res = await fetch(`/api/contracts/${id}`);
    if (!res.ok) throw new Error('Failed to fetch contract');
    return res.json();
  }
  
export async function updateContract(id: string, data: any) {
    const res = await fetch(`/api/contracts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update contract');
}

export async function deleteContract(id: string) {
    const res = await fetch(`/api/contracts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete contract');
}

export async function createContract(data: any) {
    const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create contract');
}   