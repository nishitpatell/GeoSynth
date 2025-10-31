/**
 * App Router
 * Centralized route configuration
 */

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ROUTES } from "@/shared/constants";

// Pages
import Index from "@/pages/Index.jsx";
import Auth from "@/pages/Auth";
import CountryProfile from "@/pages/CountryProfile";
import Wishlist from "@/pages/Wishlist";
import Compare from "@/pages/Compare";
import Profiles from "@/pages/Profiles";
import CurrencyConverterPage from "@/pages/CurrencyConverterPage";
import News from "@/pages/News";
import Demographics from "@/pages/Demographics";
import NotFound from "@/pages/NotFound";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.HOME} element={<Index />} />
      <Route path={ROUTES.AUTH} element={<Auth />} />
      <Route path={ROUTES.NEWS} element={<News />} />
      <Route path={ROUTES.DEMOGRAPHICS} element={<Demographics />} />
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
      <Route
        path={ROUTES.CURRENCY}
        element={
          <ProtectedRoute>
            <CurrencyConverterPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <Profiles />
          </ProtectedRoute>
        }
      />

      {/* 404 - Must be last */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
    </Routes>
  );
};
