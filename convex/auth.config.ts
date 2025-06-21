export default {
  providers: [
    {
      domain: "https://safe-jawfish-65.clerk.accounts.dev/", //make sure this url is the one from clerk API_KEYS
      applicationID: "convex",
    },
  ],
};
// import { defineAuth } from "convex/server";
// import { clerkAuth } from "@convex-dev/auth/clerk"; // o desde "convex/server/third-party/clerk" según versión

// export default defineAuth({
//   providers: [clerkAuth()],
//   publicRoutes: [], // rutas sin auth, si aplica
// });

