'use client';
import { useEffect, useState } from 'react';

export default function ConnectGoogle() {
  const [googleLinked, setGoogleLinked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/google/status')
      .then((r) => r.json())
      .then((data) => setGoogleLinked(Boolean(data.linked)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = () => {
    window.location.href = '/api/google/connect';
  };

  const handleDisconnect = async () => {
    const res = await fetch('/api/google/disconnect', { method: 'POST' });
    if (res.ok) setGoogleLinked(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Google Integration</h2>
      {googleLinked ? (
        <div>
          <p>Google account linked</p>
          <button onClick={handleDisconnect}>Disconnect Google</button>
        </div>
      ) : (
        <div>
          <p>No Google account linked</p>
          <button onClick={handleConnect}>Connect Google</button>
        </div>
      )}
    </div>
  );
}
