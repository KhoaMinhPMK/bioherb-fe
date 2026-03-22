import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { I18nProvider } from './contexts/I18nContext';
import Routers from './Routers';
import './assets/scss/styles.scss';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode>
        <ErrorBoundary>
            <I18nProvider>
                <AuthProvider>
                    <ToastProvider>
                        <BrowserRouter>
                            <Routers />
                        </BrowserRouter>
                    </ToastProvider>
                </AuthProvider>
            </I18nProvider>
        </ErrorBoundary>
    </React.StrictMode>);

