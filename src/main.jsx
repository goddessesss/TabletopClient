import React from "react";
import ReactDOM from "react-dom/client"; 
import { BrowserRouter } from "react-router-dom"; 
import { AuthProvider } from './components/Context/AuthContext.jsx'; 
import { FilterProvider } from './components/Context/FilterContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from "./utils/apiConfig.js";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n.js';

import { LanguageProvider } from './components/Context/LanguageContext.jsx';  

import App from "./App";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <FilterProvider>
              <LanguageProvider> 
                <BrowserRouter> 
                  <App />
                </BrowserRouter>
              </LanguageProvider>
            </FilterProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </I18nextProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found!");
}
