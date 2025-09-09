import { Link } from 'react-router';

export default function Profile() {
  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Link
            to="/profile/edit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gray-300">
                <span className="text-4xl text-gray-600">=d</span>
              </div>
              <h2 className="mb-1 text-xl font-semibold">John Coffee Lover</h2>
              <p className="text-gray-600">Coffee Enthusiast</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold">About Me</h3>
                <p className="text-gray-700">
                  Passionate coffee enthusiast with over 5 years of experience
                  in brewing and recipe development. I love experimenting with
                  different brewing methods and sharing my discoveries with the
                  community.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong> john@example.com
                  </p>
                  <p>
                    <strong>Location:</strong> Portland, OR
                  </p>
                  <p>
                    <strong>Member Since:</strong> January 2024
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold">Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Recipes Created</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">45</div>
                    <div className="text-sm text-gray-600">
                      Recipes Favorited
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">28</div>
                    <div className="text-sm text-gray-600">Reviews Written</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">My Recent Recipes</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Perfect Cold Brew</h3>
            <p className="mb-3 text-sm text-gray-600">
              Smooth and refreshing summer coffee
            </p>
            <div className="text-xs text-gray-500">Created 3 days ago</div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Cinnamon Latte</h3>
            <p className="mb-3 text-sm text-gray-600">
              Warming spiced coffee perfect for fall
            </p>
            <div className="text-xs text-gray-500">Created 1 week ago</div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Ethiopian Pour Over</h3>
            <p className="mb-3 text-sm text-gray-600">
              Highlighting fruity Ethiopian beans
            </p>
            <div className="text-xs text-gray-500">Created 2 weeks ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}
