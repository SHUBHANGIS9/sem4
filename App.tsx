import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [swaggerUrl, setSwaggerUrl] = useState(
    "https://petstore.swagger.io/v2/swagger.json"
  );
  const [apiEndpoint, setApiEndpoint] = useState("/pet/findByStatus");
  const [params, setParams] = useState('{ "status": "available" }');
  const [apiResponse, setApiResponse] = useState<any[]>([]);

  const fetchApiData = async () => {
    try {
      const parsedParams = JSON.parse(params);
      
      // Explicitly call axios.get() instead of axios[method]
      const response = await axios.get(
        `https://petstore.swagger.io/v2${apiEndpoint}`,
        { params: parsedParams }
      );

      setApiResponse(response.data);
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>JSON Data Fetcher</h1>
      <div>
        <label>Swagger URL:</label>
        <input
          type="text"
          value={swaggerUrl}
          onChange={(e) => setSwaggerUrl(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      </div>
      <div>
        <label>API Endpoint:</label>
        <input
          type="text"
          value={apiEndpoint}
          onChange={(e) => setApiEndpoint(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      </div>
      <div>
        <label>Parameters (JSON):</label>
        <input
          type="text"
          value={params}
          onChange={(e) => setParams(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      </div>
      <button onClick={fetchApiData} style={{ marginBottom: "20px" }}>
        Fetch Data
      </button>

      {apiResponse.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Name</th>
              <th>Photo</th>
              <th>Tags</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {apiResponse.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.category?.name || "N/A"}</td>
                <td>{item.name}</td>
                <td>
                  {item.photoUrls?.length > 0 ? (
                    <img
                      src={item.photoUrls[0]}
                      alt={item.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{item.tags?.map((tag: any) => tag.name).join(", ") || "N/A"}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
