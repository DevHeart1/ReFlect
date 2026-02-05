import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // StrictMode temporarily disabled to prevent Supabase auth double-execution
  // See: https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development
  <GoogleOAuthProvider clientId="528479351223-t5i515j80h3ruroioj3noma57q8fmeig.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
