import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import MainLayout from "../components/feature/MainLayout";

const HomePage = lazy(() => import("../pages/home/page"));
const AboutPage = lazy(() => import("../pages/about/page"));
const BusinessPage = lazy(() => import("../pages/business/page"));
const InvestmentsPage = lazy(() => import("../pages/investments/page"));
const ESGPage = lazy(() => import("../pages/esg/page"));
const CareersPage = lazy(() => import("../pages/careers/page"));
const ContactPage = lazy(() => import("../pages/contact/page"));
const RefexRefrigerantsPage = lazy(() => import("../pages/refex-refrigerants/page"));
const RefexRenewablesPage = lazy(() => import("../pages/refex-renewables/page"));
const RefexAshCoalPage = lazy(() => import("../pages/refex-ash-coal-handling/page"));
const RefexMedtechPage = lazy(() => import("../pages/refex-medtech/page"));
const RefexCapitalPage = lazy(() => import("../pages/refex-capital/page"));
const RefexAirportsPage = lazy(() => import("../pages/refex-airports/page"));
const VenwindRefexPage = lazy(() => import("../pages/venwind-refex/page"));
const PharmaRLFineChemPage = lazy(() => import("../pages/pharma-rl-fine-chem/page"));
const NotFoundPage = lazy(() => import("../pages/NotFound"));
import RefexMobilityPage from '../pages/refex-mobility/page';
const NewsroomPage = lazy(() => import('../pages/newsroom/page'));
const DiversityInclusionPage = lazy(() => import('../pages/diversity-inclusion/page'));
const GalleryPage = lazy(() => import('../pages/gallery/page'));
const Gallery2026Page = lazy(() => import('../pages/gallery-2026/page'));
const Gallery2025Page = lazy(() => import('../pages/gallery-2025/page'));
const Gallery2024 = lazy(() => import('../pages/gallery-2024/page'));
const Gallery2023 = lazy(() => import('../pages/gallery-2023/page'));
const Gallery2022 = lazy(() => import('../pages/gallery-2022/page'));
// Import dynamic gallery year page - now using year-dynamic folder (brackets cause issues)
const DynamicGalleryYearPage = lazy(() => import('../pages/gallery/year-dynamic/page'));
const PrivacyPolicyPage = lazy(() => import('../pages/privacy-policy/page'));
const TermsOfUsePage = lazy(() => import('../pages/terms-of-use/page'));

// Admin Pages
const AdminLoginPage = lazy(() => import('../pages/admin/Login'));
const AdminDashboardPage = lazy(() => import('../pages/admin/Dashboard'));


const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about-refex",
    element: <AboutPage />,
  },
  {
    path: "/business",
    element: <BusinessPage />,
  },
  // DISABLED: Refex Refrigerants page - kept for future re-enabling
  // {
  //   path: "/refex-refrigerants",
  //   element: <RefexRefrigerantsPage />,
  // },
  {
    path: "/refex-renewables",
    element: (
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <RefexRenewablesPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: "/investments",
    element: <InvestmentsPage />,
  },
  {
    path: "/esg",
    element: <ESGPage />,
  },
  {
    path: "/careers",
    element: <CareersPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/refex-ash-coal-handling",
    element: (
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <RefexAshCoalPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: "/refex-medtech",
    element: (
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <RefexMedtechPage />
        </Suspense>
      </MainLayout>
    ),
  },
  // DISABLED: Refex Capital page - kept for future re-enabling
  // {
  //   path: "/refex-capital",
  //   element: (
  //     <Suspense fallback={<div>Loading...</div>}>
  //       <RefexCapitalPage />
  //     </Suspense>
  //   ),
  // },
  {
    path: "/refex-airports",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RefexAirportsPage />
      </Suspense>
    ),
  },
  {
    path: "/venwind-refex",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <VenwindRefexPage />
      </Suspense>
    ),
  },
  {
    path: "/pharma-rl-fine-chem",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PharmaRLFineChemPage />
      </Suspense>
    ),
  },
  {
    path: "/refex-mobility",
    element: <RefexMobilityPage />,
  },
  {
    path: "/newsroom",
    element: <NewsroomPage />,
  },
  {
    path: "/diversity-inclusion",
    element: <DiversityInclusionPage />,
  },
  {
    path: "/gallery",
    element: <GalleryPage />,
  },
  // Static year routes (for backward compatibility)
  {
    path: "/gallery-2026",
    element: (
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Gallery2026Page />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: "/gallery-2025",
    element: (
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Gallery2025Page />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: "/gallery-2024",
    element: (
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Gallery2024 />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: "/gallery-2023",
    element: (
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Gallery2023 />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: "/gallery-2022",
    element: (
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <Gallery2022 />
        </Suspense>
      </MainLayout>
    ),
  },
  // Dynamic year route - must come after static routes
  // This route will match any /gallery-YYYY pattern (e.g., /gallery-2026, /gallery-2027, etc.)
  {
    path: "/gallery-:year",
    element: (
      <MainLayout>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading gallery page...</p>
              </div>
            </div>
          }
        >
          <DynamicGalleryYearPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: "/privacy-policy",
    element: (
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <PrivacyPolicyPage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: "/terms-of-use",
    element: (
      <MainLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <TermsOfUsePage />
        </Suspense>
      </MainLayout>
    ),
  },
  {
    path: "/admin/login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AdminDashboardPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default routes;
