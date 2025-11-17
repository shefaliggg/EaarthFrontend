import React from "react";
import { Route } from "react-router-dom";
import { LoginScreenUI } from "../components/forms/LoginForm";



const authRoutes = [

    <Route path="/login" element={<LoginScreenUI/>} />,

]

export default authRoutes;
