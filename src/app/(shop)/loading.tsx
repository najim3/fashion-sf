export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-screen animate-pulse">
      <div className="h-[80vh] w-full bg-gray-200" />
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="h-10 w-64 bg-gray-200 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="h-96 bg-gray-200 rounded" />
            <div className="h-96 bg-gray-200 rounded" />
            <div className="h-96 bg-gray-200 rounded" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
