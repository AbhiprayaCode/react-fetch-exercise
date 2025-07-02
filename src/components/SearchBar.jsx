import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, List, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Optionally, you can fetch here to validate, but we just navigate to /books with state
      navigate('/books', { state: { search: query } });
    } catch (error) {
      setError('An error occurred while searching for books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', marginBottom: '1rem' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
        <Input.Search
          placeholder="Search Book by name and category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          enterButton="Search"
          loading={loading}
          onSearch={() => handleSearch({ preventDefault: () => {} })}
          style={{ width: 400 }}
        />
      </form>
      {error && (
        <Alert message={error} type="error" showIcon style={{ marginTop: 8 }} />
      )}
    </div>
  );
}

export default SearchBar;
