import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './configs/i18n';
import './styles/global.css';
import './styles/rtl.css';
import I18nDirectionProvider from './providers/I18nDirectionProvider';
import { TelemetryProvider } from './providers/TelemetryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import "./index.css";
import { initializeApiClient } from './api/config';

initializeApiClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nDirectionProvider>
        <TelemetryProvider>
          <App />
        </TelemetryProvider>
      </I18nDirectionProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
