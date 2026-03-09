const Loader = ({ size = 'md', text = 'Loading...' }) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className={`${sizes[size]} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`} />
            {text && <p className="text-text-muted text-sm font-medium">{text}</p>}
        </div>
    );
};

export default Loader;
