// app.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import Home from "./Home";
import Help from "./Help";

interface Endpoint {
  path: string;
  method: string;
}

type AppView = 'home' | 'app' | 'help';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');

  // --- All your existing state variables ---
  const [jsonUrl, setJsonUrl] = useState("");
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [httpMethod, setHttpMethod] = useState("get");
  const [params, setParams] = useState("{}");
  const [baseApiUrl, setBaseApiUrl] = useState("");
  const [apiData, setApiData] = useState<any>(null);
  const [error, setError] = useState("");
  const [isSwagger, setIsSwagger] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Existing functions from your original App.tsx ---
  const fetchJsonData = async () => {
    try {
      const response = await axios.get(jsonUrl);
      const spec = response.data;
      if (spec.paths && spec.schemes && spec.host && spec.basePath) {
        setIsSwagger(true);
        const scheme = spec.schemes?.[0] || "https";
        const host = spec.host || new URL(jsonUrl).host; // Use URL from jsonUrl if host not provided
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
        setSelectedEndpoint(endpoints[0]); // Select the first endpoint by default
        setHttpMethod(endpoints[0]?.method || "get"); // Default to 'get' if no endpoints
        setError("");
      } else {
        setIsSwagger(false);
        setBaseApiUrl("");
        setEndpoints([]);
        setError("");
        setApiData(spec); // Assume it's direct JSON data
      }
    } catch (err) {
      setError("Invalid JSON URL or failed to fetch: " + (axios.isAxiosError(err) ? err.message : String(err)));
      setEndpoints([]);
      setApiData(null);
    }
  };

  const fetchData = async () => {
    try {
      const parsedParams = JSON.parse(params);
      if (!selectedEndpoint) {
        setError("No endpoint selected.");
        return;
      }
      const finalUrl = `${baseApiUrl}${selectedEndpoint.path}`;

      const response = await axios({
        method: httpMethod,
        url: finalUrl,
        params: httpMethod.toLowerCase() === "get" ? parsedParams : undefined, // Params for GET requests
        data: httpMethod.toLowerCase() !== "get" ? parsedParams : undefined, // Data for non-GET requests (POST, PUT, etc.)
      });

      setApiData(response.data);
      setError("");
      setCurrentPage(1); // Reset pagination on new fetch
    } catch (err: any) {
      setError("Failed to fetch data: " + (axios.isAxiosError(err) ? err.message : String(err)));
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

    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0) {
      return <p>No data to display.</p>;
    }

    const keys = Object.keys(dataArray[0] || {});

    const filteredData = dataArray.filter((item) =>
      keys.some((key) =>
        item[key]?.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );

    const sortedData = [...filteredData].sort((a, b) => {
      if (!sortKey) return 0;
      const aValue = a[sortKey]?.toString().toLowerCase() || "";
      const bValue = b[sortKey]?.toString().toLowerCase() || "";
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(start, start + itemsPerPage);

    return (
      <>
        <div className="table-controls">
          <input
            type="text"
            placeholder="🔍 Filter..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="filter-input"
          />
        </div>

        <table className="styled-table">
          <thead>
            <tr>
              {keys.map((key) => (
                <th
                  key={key}
                  onClick={() => {
                    setSortKey(key);
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {key} {sortKey === key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                {keys.map((key) => (
                  <td key={key}>
                    {Array.isArray(item[key]) && key === "photoUrls" ? (
                      item[key].length > 0
                        ? JSON.stringify(item[key].filter(isValidUrl))
                        : "No photos available"
                    ) : typeof item[key] === "object" && item[key] !== null ? (
                      JSON.stringify(item[key])
                    ) : (
                      item[key]?.toString() || "N/A"
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            className="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ⬅️ Prev
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next ➡️
          </button>
        </div>
      </>
    );
  };


  // Handlers to change the view
  const handleGetStarted = () => {
    setCurrentView('app');
  };

  const handleShowHelp = () => {
    setCurrentView('help');
  };

  const handleCloseHelp = () => {
    // If coming from home, go back to home; otherwise, go to app
    // This logic ensures 'Close Help' from help page goes to the appropriate view
    if (currentView === 'help' && !jsonUrl && !apiData && !endpoints.length) {
        setCurrentView('home');
    } else {
        setCurrentView('app');
    }
  };


  useEffect(() => {
    if (currentView === 'home') {
      document.body.classList.add('home-active');
      document.body.classList.remove('app-active');
    } else { // 'app' or 'help'
      document.body.classList.remove('home-active');
      document.body.classList.add('app-active');
    }
    return () => {
      document.body.classList.remove('home-active');
      document.body.classList.remove('app-active');
    };
  }, [currentView]);


  return (
    <>
      {currentView === 'home' && (
        <Home onGetStarted={handleGetStarted} />
      )}

      {currentView === 'help' && (
        <Help onCloseHelp={handleCloseHelp} />
      )}

      {currentView === 'app' && (
        <div className="container">
          <h2>🌐 Welcome to Jsonique</h2>
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

          {isSwagger && endpoints.length > 0 && selectedEndpoint && (
            <div className="api-form">
              <h3>🎯 Request Options</h3>

              <label>🧭 Endpoint:</label>
              <select
                value={`${selectedEndpoint.path}|${selectedEndpoint.method}`}
                onChange={(e) => {
                  const [path, method] = e.target.value.split("|");
                  const endpoint = endpoints.find(
                    (ep) => ep.path === path && ep.method === method
                  );
                  if (endpoint) {
                    setSelectedEndpoint(endpoint);
                    setHttpMethod(method);
                  }
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
    <h3 style={{ fontSize: "40px" }} className="section-heading">📊 API Response</h3>
    {renderTable(apiData)}
  </div>
)}
        </div>
      )}

      {/* Global Help Button - always rendered unless on the help page itself */}
      {currentView !== 'help' && (
        <button className="button global-help-button" onClick={handleShowHelp}>
          ? Help
        </button>
      )}
    </>
  );
};

export default App;
