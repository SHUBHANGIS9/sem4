// Help.tsx
import React from 'react';

interface HelpProps {
  onCloseHelp: () => void; // Function to close the help page and go back
}

const Help: React.FC<HelpProps> = ({ onCloseHelp }) => {
  return (
    <div className="help-page-container"> {/* Use a class for overall help page styling */}
      <div className="help-content-card"> {/* A card for the content itself */}
        <h2 className="help-title">Jsonique: How It Works</h2>

        <section className="help-section">
          <h3>1. Initial Setup:</h3>
          <p>Upon launching Jsonique, you'll see a welcome screen. Click "Get Started" to proceed to the main application interface.</p>
        </section>

        <section className="help-section">
          <h3>2. Loading Data:</h3>
          <p>In the main interface, you'll find an input field labeled "Enter JSON URL". You can paste two types of URLs here:</p>
          <ul>
            <li>
              <strong>Direct JSON Data:</strong> A URL that directly returns JSON data (e.g., from a REST API endpoint). Jsonique will fetch this data and display it in a dynamic, sortable, and filterable table.
            </li>
            <li>
              <strong>Swagger/OpenAPI Spec:</strong> A URL pointing to a Swagger (OpenAPI) JSON specification file (e.g., `swagger.json` or `openapi.json`). If a Swagger URL is detected, Jsonique will parse it to identify all available API endpoints.
            </li>
          </ul>
          <p>Click the "Generate Endpoints" button after entering the URL.</p>
        </section>

        <section className="help-section">
          <h3>3. Working with Swagger Endpoints:</h3>
          <p>If you've loaded a Swagger spec, a "Request Options" section will appear:</p>
          <ul>
            <li>
              <strong>Endpoint Selector:</strong> Choose from the dropdown list of discovered API paths and their associated HTTP methods (GET, POST, PUT, DELETE).
            </li>
            <li>
              <strong>HTTP Method:</strong> Displays the method for the selected endpoint.
            </li>
            <li>
              <strong>Params (JSON):</strong> For endpoints that require parameters (query params for GET, or request body for POST/PUT/DELETE), enter them as a valid JSON object here. For example:
              <code className="inline-code">{"{\"id\": 123}"}</code> or <code className="inline-code">{"{\"name\": \"New Item\", \"value\": 100}"}</code>.
            </li>
          </ul>
          <p>Click "Fetch Data" to make a request to the selected API endpoint and display its response.</p>
        </section>

        <section className="help-section">
          <h3>4. Interacting with the Table:</h3>
          <p>Once data is fetched, it's displayed in a clear, interactive table:</p>
          <ul>
            <li>
              <strong>Filtering:</strong> Use the "🔍 Filter..." input box to quickly narrow down rows based on any column's content.
            </li>
            <li>
              <strong>Sorting:</strong> Click on any column header (e.g., "id", "name") to sort the table data by that column in ascending or descending order. An arrow (↑ or ↓) indicates the current sort direction.
            </li>
            <li>
              <strong>Pagination:</strong> Navigate through large datasets using the "⬅️ Prev" and "Next ➡️" buttons. Each page displays 10 items.
            </li>
          </ul>
        </section>

        <section className="help-section">
          <h3>5. Error Handling:</h3>
          <p>If there's an issue fetching data (e.g., invalid URL, network error, API error), an error message will be displayed below the URL input field.</p>
        </section>

        <button className="button close-help-button" onClick={onCloseHelp}>
          Close Help
        </button>
      </div>
    </div>
  );
};

export default Help;