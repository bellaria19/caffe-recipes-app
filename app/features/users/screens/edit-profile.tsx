import { Form, Link } from "react-router";

export default function EditProfile() {
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <Link to="/profile" className="text-blue-600 hover:text-blue-800">
          � 프로필로 돌아가기
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">프로필 수정</h1>
        
        <Form method="post" className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl text-gray-600">=d</span>
            </div>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              프로필 사진 변경
            </button>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue="John Coffee Lover"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일 주소
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue="john@example.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              위치
            </label>
            <input
              type="text"
              id="location"
              name="location"
              defaultValue="Portland, OR"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="위치를 입력하세요"
            />
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              자기소개
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue="Passionate coffee enthusiast with over 5 years of experience in brewing and recipe development. I love experimenting with different brewing methods and sharing my discoveries with the community."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="자신에 대해 알려주세요"
            />
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              웹사이트 (선택사항)
            </label>
            <input
              type="url"
              id="website"
              name="website"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://your-website.com"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">알림 설정</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">새 댓글 이메일 알림</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="recipeUpdates"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">주간 레시피 추천</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="communityUpdates"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">커뮤니티 업데이트 및 이벤트</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              변경사항 저장
            </button>
            <Link
              to="/profile"
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              취소
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}