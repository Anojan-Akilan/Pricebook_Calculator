const API = process.env.REACT_APP_API_URL;

export async function getRegions() {
  const res = await fetch(`${API}/regions`);
  return res.json();
}

export async function getCountries(region) {
  const res = await fetch(`${API}/countries?region=${region}`);
  return res.json();
}

export async function getPricing(params) {
  const res = await fetch(`${API}/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch');
  }

  return res.json();
}
