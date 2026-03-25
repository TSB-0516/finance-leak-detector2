const BASE_URL = 'http://localhost:8000';

export async function analyzeStatement(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Server error: ${response.status}`);
  }

  return response.json();
}
