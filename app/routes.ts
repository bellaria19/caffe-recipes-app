import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('features/home/screens/home.tsx'),
  ...prefix('recipes', [
    layout('features/recipes/layouts/create-recipe-layout.tsx', [
      route('/create', 'features/recipes/screens/create-recipe.tsx'),
      route('/create/espresso', 'features/recipes/screens/create-espresso.tsx'),
      route('/create/drip', 'features/recipes/screens/create-drip.tsx'),
    ]),
    layout('features/recipes/layouts/recipe-layout.tsx', [
      route('/:id', 'features/recipes/screens/recipe.tsx'),
      route('/edit/:id', 'features/recipes/screens/edit-recipe.tsx'),
    ]),
  ]),
  ...prefix('/auth', [
    layout('features/auth/layouts/auth-layout.tsx', [
      route('/login', 'features/auth/screens/login.tsx'),
      route('/join', 'features/auth/screens/join.tsx'),
      route('/logout', 'features/auth/screens/logout.tsx'),
      ...prefix('social/:provider', [
        route('/login', 'features/auth/screens/social-login.tsx'),
        route('/callback', 'features/auth/screens/social-callback.tsx'),
      ]),
    ]),
  ]),
  ...prefix('/profile', [
    index('features/users/screens/profile.tsx'),
    route('/edit', 'features/users/screens/edit-profile.tsx'),
  ]),
  route('/my-recipes', 'features/users/screens/my-recipes.tsx'),
] satisfies RouteConfig;
