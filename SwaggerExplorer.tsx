import React, { useState } from "react";
import axios from "axios";
import "./styles.css"; // Assuming styles are defined here

const SwaggerExplorer: React.FC = () => {
  const [swaggerUrl, setSwaggerUrl] = useState("");
  const [apiEndpoints, setApiEndpoints] = useState<string[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [httpMethod, setHttpMethod] = useState("get");
  const [params, setParams] = useState("{}");
  const [apiResponse, setApiResponse] = useState<any>(null);

  const fetchSwaggerData = async () => {
    try {
      const response = await axios.get(swaggerUrl);
      const paths = response.data.paths;
      const endpoints = Object.keys(paths);
      setApiEndpoints(endpoints);
      setSelectedEndpoint(endpoints[0] || "");
    } catch (error) {
      console.error("Error fetching Swagger data:", error);
      setApiEndpoints([]);
      setSelectedEndpoint("");
    }
  };

  const fetchApiData = async () => {
    try {
      const parsedParams = JSON.parse(params);
      const baseUrl = swaggerUrl.replace("/swagger.json", "").replace("http://", "https://");
      const fullUrl = `${baseUrl}${selectedEndpoint}`;

      const response = await axios({
        method: httpMethod,
        url: fullUrl,
        params: httpMethod === "get" ? parsedParams : undefined,
        data: httpMethod !== "get" ? parsedParams : undefined,
      });
      setApiResponse(response.data);
    } catch (error) {
      console.error("Error fetching API data:", error);
      setApiResponse(null);
    }
  };

  const renderTable = (data: any) => {
    if (!data) return null;

    const keys = Array.isArray(data) ? Object.keys(data[0]) : Object.keys(data);
    return (
      <table className="response-table">
        <thead>
          <tr>
            {keys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) ? (
            data.map((item, index) => (
              <tr key={index}>
                {keys.map((key) => (
                  <td key={key}>{item[key]?.toString() ?? "N/A"}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              {keys.map((key) => (
                <td key={key}>{data[key]?.toString() ?? "N/A"}</td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="swagger-page">
      <h1>🔎 Swagger API Explorer</h1>
      <input
        type="text"
        placeholder="Enter Swagger URL"
        value={swaggerUrl}
        onChange={(e) => setSwaggerUrl(e.target.value)}
        className="input"
      />
      <button onClick={fetchSwaggerData} className="button">🔄 Load Endpoints</button>

      {apiEndpoints.length > 0 && (
        <>
          <select
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="input"
          >
            {apiEndpoints.map((ep) => (
              <option key={ep} value={ep}>
                {ep}
              </option>
            ))}
          </select>

          <select
            value={httpMethod}
            onChange={(e) => setHttpMethod(e.target.value)}
            className="input"
          >
            <option value="get">GET</option>
            <option value="post">POST</option>
            <option value="put">PUT</option>
            <option value="delete">DELETE</option>
          </select>

          <input
            type="text"
            placeholder='Params (JSON)'
            value={params}
            onChange={(e) => setParams(e.target.value)}
            className="input"
          />

          <button onClick={fetchApiData} className="button">🚀 Fetch Data</button>
        </>
      )}

      {apiResponse && renderTable(apiResponse)}
    </div>
  );
};

export default SwaggerExplorer;
