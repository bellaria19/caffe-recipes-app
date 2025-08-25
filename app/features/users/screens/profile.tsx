import { Link } from "react-router";

export default function Profile() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Link
            to="/profile/edit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-gray-600">=d</span>
              </div>
              <h2 className="text-xl font-semibold mb-1">John Coffee Lover</h2>
              <p className="text-gray-600">Coffee Enthusiast</p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">About Me</h3>
                <p className="text-gray-700">
                  Passionate coffee enthusiast with over 5 years of experience in brewing
                  and recipe development. I love experimenting with different brewing methods
                  and sharing my discoveries with the community.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p><strong>Email:</strong> john@example.com</p>
                  <p><strong>Location:</strong> Portland, OR</p>
                  <p><strong>Member Since:</strong> January 2024</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Recipes Created</div>
                  </div>
                  <div className="text-center bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">45</div>
                    <div className="text-sm text-gray-600">Recipes Favorited</div>
                  </div>
                  <div className="text-center bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">28</div>
                    <div className="text-sm text-gray-600">Reviews Written</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">My Recent Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Perfect Cold Brew</h3>
            <p className="text-gray-600 text-sm mb-3">Smooth and refreshing summer coffee</p>
            <div className="text-xs text-gray-500">Created 3 days ago</div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Cinnamon Latte</h3>
            <p className="text-gray-600 text-sm mb-3">Warming spiced coffee perfect for fall</p>
            <div className="text-xs text-gray-500">Created 1 week ago</div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Ethiopian Pour Over</h3>
            <p className="text-gray-600 text-sm mb-3">Highlighting fruity Ethiopian beans</p>
            <div className="text-xs text-gray-500">Created 2 weeks ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}