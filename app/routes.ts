import {
  type RouteConfig,
  index,
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
  route("/search", "features/search/screens/search.tsx"),
  ...prefix("/auth", [
    route("/login", "features/auth/screens/login.tsx"),
    route("/join", "features/auth/screens/join.tsx"),
  ]),
  ...prefix("/profile", [
    index("features/users/screens/profile.tsx"),
    route("/edit", "features/users/screens/edit-profile.tsx"),
  ]),
] satisfies RouteConfig;
