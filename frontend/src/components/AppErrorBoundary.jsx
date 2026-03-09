import React from 'react';

class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            errorMessage: error?.message || 'Unknown runtime error',
        };
    }

    componentDidCatch(error, errorInfo) {
        // Keep a clear console trace for browser-side diagnostics.
        // eslint-disable-next-line no-console
        console.error('SmartPrep runtime error:', error, errorInfo);
    }

    handleClearAndReload = () => {
        try {
            localStorage.removeItem('smartprep_token');
            localStorage.removeItem('smartprep_user');
            localStorage.removeItem('smartprep-theme-mode');
        } catch {
            // Ignore storage access issues.
        }
        window.location.reload();
    };

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-6">
                <div className="max-w-xl w-full card">
                    <h1 className="text-xl font-bold font-heading mb-3">SmartPrep crashed at runtime</h1>
                    <p className="text-sm text-text-muted mb-2">
                        The app hit a browser-side error and could not render.
                    </p>
                    <p className="text-xs font-mono bg-gray-100 text-red-600 rounded-lg p-3 mb-5 break-words">
                        {this.state.errorMessage}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={this.handleClearAndReload} className="btn-primary text-sm py-2">
                            Clear Local Data + Reload
                        </button>
                        <button type="button" onClick={() => window.location.reload()} className="btn-secondary text-sm py-2">
                            Reload
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppErrorBoundary;
