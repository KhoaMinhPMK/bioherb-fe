import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { I18nProvider } from './contexts/I18nContext';
import { DataProvider } from './contexts/DataContext';
import { FeatureFlagProvider } from './contexts/FeatureFlagContext';
import Routers from './Routers';
import './assets/scss/styles.scss';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <I18nProvider>
                <AuthProvider>
                    <FeatureFlagProvider>
                        <ToastProvider>
                            <DataProvider>
                                <BrowserRouter>
                                    <Routers />
                                </BrowserRouter>
                            </DataProvider>
                        </ToastProvider>
                    </FeatureFlagProvider>
                </AuthProvider>
            </I18nProvider>
        </ErrorBoundary>
    </React.StrictMode>,
);
