import { Form, useParams } from "react-router";

export default function EditRecipe() {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">레시피 수정</h1>
      
      <Form method="post" className="space-y-6">
        <input type="hidden" name="id" value={id} />
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            레시피 이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue="Sample Recipe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            설명
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue="A delicious coffee recipe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
            재료
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            rows={5}
            required
            defaultValue="Coffee beans\nHot water\nSugar (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
            만드는 법
          </label>
          <textarea
            id="instructions"
            name="instructions"
            rows={8}
            required
            defaultValue="1. Heat water to 200�F\n2. Grind coffee beans\n3. Brew for 4 minutes\n4. Serve hot"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            레시피 업데이트
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            취소
          </button>
        </div>
      </Form>
    </div>
  );
}