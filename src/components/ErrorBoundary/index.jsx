import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import './ErrorBoundary.scss';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        if (process.env.NODE_ENV === 'production') {
            console.error('[ErrorBoundary]', error, errorInfo);
        }
    }
    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <div className="error-boundary" role="alert">
                    <div className="error-boundary__content">
                        <AlertTriangle size={48} className="error-boundary__icon" aria-hidden="true" />
                        <h2 className="error-boundary__title">Đã xảy ra lỗi</h2>
                        <p className="error-boundary__message">Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại.</p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-boundary__details">
                                <summary>Chi tiết lỗi (development only)</summary>
                                <pre>{this.state.error.toString()}</pre>
                                <pre>{this.state.errorInfo?.componentStack}</pre>
                            </details>
                        )}
                        <button className="btn btn--primary error-boundary__btn" onClick={this.handleReset}>
                            <RefreshCw size={16} /> Thử lại
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    fallback: PropTypes.node,
};
export default ErrorBoundary;
