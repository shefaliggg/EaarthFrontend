import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import authRoutes from "../features/auth/context/AuthContext.jsx";





const AppRoutes = () => (
//   <Suspense fallback={<LoadingScreen />}>
    <Routes>


      
      {/* Authentication Routes */}
      {authRoutes}

      {/* {ProjectRoutes}

      {/* Chatbot Routes */}
      {/* {ChatbotRoutes}//  */}

      {/* Fallback placeholder */}
      {/* <Route path="*" element={<PlaceholderPage />} /> */}
    </Routes>
//   </Suspense>
);

export default AppRoutes;