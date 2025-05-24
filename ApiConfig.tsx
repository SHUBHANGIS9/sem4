export const apiConfig = {
    endpoint: "https://petstore.swagger.io/", // Replace with your API endpoint
    params: {
      // Define any parameters needed for the API call
      param1: "value1",
      param2: "value2",
    },
  };// src/ApiConfig.tsx
  import React, { useState } from 'react';
  import axios from 'axios';
  
  interface ApiConfigProps {
    onFetchData: (data: any[]) => void;
  }
  
  const ApiConfig: React.FC<ApiConfigProps> = ({ onFetchData }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
  
    const handleFetchData = async () => {
      try {
        const response = await axios.get(url);
        onFetchData(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch data. Please check the URL.');
      }
    };
  
    return (
      <div>
        <h2>API Configuration</h2>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter API endpoint"
        />
        <button onClick={handleFetchData}>Fetch Data</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  };
  
  export default ApiConfig;
  