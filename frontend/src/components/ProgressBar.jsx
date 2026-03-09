const ProgressBar = ({ value = 0, max = 100, color = 'bg-primary-600', height = 'h-2', showLabel = false, className = '' }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-text-muted">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
                <div
                    className={`${height} ${color} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
