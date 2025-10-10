/**
 * App Router
 * Centralized route configuration
 */

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ROUTES } from "@/shared/constants";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import CountryProfile from "@/pages/CountryProfile";
import Wishlist from "@/pages/Wishlist";
import Compare from "@/pages/Compare";
import NotFound from "@/pages/NotFound";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.HOME} element={<Index />} />
      <Route path={ROUTES.AUTH} element={<Auth />} />
      <Route path={ROUTES.COUNTRY_PROFILE} element={<CountryProfile />} />

      {/* Protected routes */}
      <Route
        path={ROUTES.WISHLIST}
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.COMPARE}
        element={
          <ProtectedRoute>
            <Compare />
          </ProtectedRoute>
        }
      />

      {/* 404 - Must be last */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};
