import React from "react";
import ReactDOM from "react-dom/client"; 
import { BrowserRouter } from "react-router-dom"; 
import { AuthProvider } from './components/Context/AuthContext.jsx'; 
import { FilterProvider } from './components/Context/FilterContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from "./utils/apiConfig.js";

import App from "./App";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <FilterProvider>
            <BrowserRouter> 
              <App />
            </BrowserRouter>
          </FilterProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}
