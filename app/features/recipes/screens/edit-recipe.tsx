import { Form, useParams } from 'react-router';

export default function EditRecipe() {
  const { id } = useParams();

  return (
    <div className='container mx-auto max-w-2xl p-4'>
      <h1 className='mb-6 text-3xl font-bold'>레시피 수정</h1>

      <Form method='post' className='space-y-6'>
        <input type='hidden' name='id' value={id} />

        <div>
          <label
            htmlFor='name'
            className='mb-2 block text-sm font-medium text-gray-700'
          >
            레시피 이름
          </label>
          <input
            type='text'
            id='name'
            name='name'
            required
            defaultValue='Sample Recipe'
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
        </div>

        <div>
          <label
            htmlFor='description'
            className='mb-2 block text-sm font-medium text-gray-700'
          >
            설명
          </label>
          <textarea
            id='description'
            name='description'
            rows={3}
            defaultValue='A delicious coffee recipe'
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
        </div>

        <div>
          <label
            htmlFor='ingredients'
            className='mb-2 block text-sm font-medium text-gray-700'
          >
            재료
          </label>
          <textarea
            id='ingredients'
            name='ingredients'
            rows={5}
            required
            defaultValue='Coffee beans\nHot water\nSugar (optional)'
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
        </div>

        <div>
          <label
            htmlFor='instructions'
            className='mb-2 block text-sm font-medium text-gray-700'
          >
            만드는 법
          </label>
          <textarea
            id='instructions'
            name='instructions'
            rows={8}
            required
            defaultValue='1. Heat water to 200�F\n2. Grind coffee beans\n3. Brew for 4 minutes\n4. Serve hot'
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
        </div>

        <div className='flex gap-4'>
          <button
            type='submit'
            className='rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          >
            레시피 업데이트
          </button>
          <button
            type='button'
            className='rounded-md bg-gray-200 px-6 py-2 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:outline-none'
          >
            취소
          </button>
        </div>
      </Form>
    </div>
  );
}
