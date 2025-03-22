const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a 
        href="/"
        className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
      >
        Go to Homepage
      </a>
    </div>
  );
};

export default ErrorPage;
