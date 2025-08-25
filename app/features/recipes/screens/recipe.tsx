import { useParams, Link } from "react-router";

export default function Recipe() {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          ê Back to Home
        </Link>
      </div>
      
      <article className="bg-white rounded-lg shadow-lg p-6">
        <header className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Perfect Pour Over Coffee</h1>
          <p className="text-gray-600 text-lg">
            A classic brewing method that brings out the best flavors in your coffee beans.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Recipe ID: {id}
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                30g freshly ground coffee beans (medium-fine grind)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                500ml filtered water (200∞F / 93∞C)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Paper filter
              </li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-3">
              <li className="flex">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center mr-3 mt-0.5">1</span>
                <span>Rinse the paper filter with hot water to remove papery taste</span>
              </li>
              <li className="flex">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center mr-3 mt-0.5">2</span>
                <span>Add ground coffee to the filter and create a small well in the center</span>
              </li>
              <li className="flex">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center mr-3 mt-0.5">3</span>
                <span>Start timer and pour 60ml water in circular motion, let bloom for 30 seconds</span>
              </li>
              <li className="flex">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center mr-3 mt-0.5">4</span>
                <span>Continue pouring in slow circles, keeping water level consistent</span>
              </li>
              <li className="flex">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center mr-3 mt-0.5">5</span>
                <span>Finish pouring by 2:30, total brew time should be around 4:00</span>
              </li>
            </ol>
          </section>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex gap-4">
            <Link
              to={`/recipes/edit?id=${id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Recipe
            </Link>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Share Recipe
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}