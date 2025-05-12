import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

interface Endpoint {
  path: string;
  method: string;
}

const App: React.FC = () => {
  const [jsonUrl, setJsonUrl] = useState("");
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [httpMethod, setHttpMethod] = useState("get");
  const [params, setParams] = useState("{}");
  const [baseApiUrl, setBaseApiUrl] = useState("");
  const [apiData, setApiData] = useState<any>(null);
  const [error, setError] = useState("");
  const [isSwagger, setIsSwagger] = useState(false);

  const fetchJsonData = async () => {
    try {
      const response = await axios.get(jsonUrl);
      const spec = response.data;

      // Check if it's a Swagger JSON
      if (spec.paths && spec.schemes && spec.host && spec.basePath) {
        setIsSwagger(true);
        const scheme = spec.schemes?.[0] || "https";
        const host = spec.host || new URL(jsonUrl).host;
        const basePath = spec.basePath || "";
        const fullBaseUrl = `${scheme}://${host}${basePath}`;
        setBaseApiUrl(fullBaseUrl);

        const paths = spec.paths;
        const endpoints: Endpoint[] = [];

        Object.keys(paths).forEach((path) => {
          const methods = Object.keys(paths[path]);
          methods.forEach((method) => {
            endpoints.push({ path, method });
          });
        });

        setEndpoints(endpoints);
        setSelectedEndpoint(endpoints[0]?.path || "");
        setHttpMethod(endpoints[0]?.method || "get");
        setError("");
      } else {
        setIsSwagger(false);
        setBaseApiUrl("");
        setEndpoints([]);
        setError("");
        setApiData(spec);
      }
    } catch (err) {
      setError("Invalid JSON URL or failed to fetch");
      setEndpoints([]);
      setApiData(null);
    }
  };

  const fetchData = async () => {
    try {
      const parsedParams = JSON.parse(params);
      const finalUrl = `${baseApiUrl}${selectedEndpoint}`;

      const response = await axios({
        method: httpMethod,
        url: finalUrl,
        params: httpMethod === "get" ? parsedParams : undefined,
        data: httpMethod !== "get" ? parsedParams : undefined,
      });

      setApiData(response.data);
      setError("");
    } catch (err: any) {
      setError("Failed to fetch data: " + err.message);
      setApiData(null);
    }
  };

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const renderTable = (data: any) => {
    if (!data) return null;

    const keys = Array.isArray(data) ? Object.keys(data[0] || {}) : Object.keys(data);

    return (
      <table className="styled-table">
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
                  <td key={key}>
                    {Array.isArray(item[key]) && key === "photoUrls" ? (
                      item[key].length > 0
                        ? JSON.stringify(item[key].filter(isValidUrl))
                        : "No photos available"
                    ) : typeof item[key] === "object" ? (
                      JSON.stringify(item[key])
                    ) : (
                      item[key]?.toString() || "N/A"
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              {keys.map((key) => (
                <td key={key}>
                  {Array.isArray(data[key]) && key === "photoUrls" ? (
                    data[key].length > 0
                      ? JSON.stringify(data[key].filter(isValidUrl))
                      : "No photos available"
                  ) : typeof data[key] === "object" ? (
                    JSON.stringify(data[key])
                  ) : (
                    data[key]?.toString() || "N/A"
                  )}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container">
      <h2>🌐 Universal JSON Explorer</h2>
      <div className="url-container">
        <input
          className="input-url"
          type="text"
          placeholder="Enter JSON URL"
          value={jsonUrl}
          onChange={(e) => setJsonUrl(e.target.value)}
        />
        <button className="button" onClick={fetchJsonData}>
          ⚙️ Generate Endpoints
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {isSwagger && endpoints.length > 0 && (
        <div className="api-form">
          <h3>🎯 Request Options</h3>

          <label>🧭 Endpoint:</label>
          <select
            value={selectedEndpoint}
            onChange={(e) => {
              const [path, method] = e.target.value.split("|");
              setSelectedEndpoint(path);
              setHttpMethod(method);
            }}
          >
            {endpoints.map((ep, idx) => (
              <option key={idx} value={`${ep.path}|${ep.method}`}>
                [{ep.method.toUpperCase()}] {ep.path}
              </option>
            ))}
          </select>

          <label>🔧 HTTP Method:</label>
          <input type="text" value={httpMethod.toUpperCase()} readOnly />

          <label>📦 Params (JSON):</label>
          <input
            type="text"
            value={params}
            onChange={(e) => setParams(e.target.value)}
            placeholder='{"key":"value"}'
          />

          <button className="button" onClick={fetchData}>
            📡 Fetch Data
          </button>
        </div>
      )}

      {apiData && (
        <div style={{ marginTop: "30px", width: "100%", textAlign: "center" }}>
          <h3 className="section-heading">📊 API Response</h3>
          {renderTable(apiData)}
        </div>
      )}
    </div>
  );
};

export default App;
