import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
      },
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "pages-1-chunk": ["src/pages/Profile.jsx"],
          "pages-2-chunk": [
            "src/pages/Home.jsx",
            "src/pages/Listing.jsx",
            "src/pages/CreateListing.jsx",
            "src/pages/About.jsx",
            "src/pages/Search.jsx",
            "src/pages/SignIn.jsx",
            "src/pages/SignUp.jsx",
            "src/pages/UpdateListing.jsx",
          ],
          "componants-chunk": [
            "src/componants/Contact.jsx",
            "src/componants/Header.jsx",
            "src/componants/ListingItem.jsx",
            "src/componants/OAuth.jsx",
            "src/componants/Pagination.jsx",
            "src/componants/PrivateRoute.jsx",
          ],
        },
      },
    },
  },
});
