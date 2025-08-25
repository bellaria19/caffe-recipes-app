export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to Caffe Recipes</h1>
      <p className="text-gray-600 mb-8">
        Discover and share amazing coffee recipes from around the world.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Featured Recipes</h2>
          <p className="text-gray-600">Check out our most popular coffee recipes</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Latest Additions</h2>
          <p className="text-gray-600">See what's new in our recipe collection</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Community</h2>
          <p className="text-gray-600">Connect with fellow coffee enthusiasts</p>
        </div>
      </div>
    </div>
  );
}