import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("features/home/screens/home.tsx"),
  ...prefix("recipes", [
    route("/create", "features/recipes/screens/create-recipe.tsx"),
    route("/edit", "features/recipes/screens/edit-recipe.tsx"),
    route("/:id", "features/recipes/screens/recipe.tsx"),
  ]),
  ...prefix("/auth", [
    layout("features/auth/layouts/auth-layout.tsx", [
      route("/login", "features/auth/screens/login.tsx"),
      route("/join", "features/auth/screens/join.tsx"),
    ]),
  ]),
  ...prefix("/profile", [
    index("features/users/screens/profile.tsx"),
    route("/edit", "features/users/screens/edit-profile.tsx"),
  ]),
  route("/my-recipes", "features/users/screens/my-recipes.tsx"),
] satisfies RouteConfig;
