export function Button({ onClick, className, children }) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-white font-bold ${className}`}
      >
        {children}
      </button> 
    );
  }
  