import { Form, useSearchParams } from "react-router";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Search Recipes</h1>
      
      <Form method="get" className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for recipes..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </Form>
      
      {query ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Results for "{query}"</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Cold Brew Coffee</h3>
              <p className="text-gray-600 mb-4">Smooth and refreshing cold brew recipe</p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View Recipe ’
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Espresso Martini</h3>
              <p className="text-gray-600 mb-4">A perfect blend of coffee and cocktail</p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View Recipe ’
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">French Press</h3>
              <p className="text-gray-600 mb-4">Classic full-bodied brewing method</p>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View Recipe ’
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Start your search</h2>
          <p className="text-gray-500">
            Enter keywords to find the perfect coffee recipe for you.
          </p>
        </div>
      )}
    </div>
  );
}