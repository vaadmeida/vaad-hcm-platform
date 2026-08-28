import LoginPage from "@/pages/auth/LoginPage";
import NotFound from "@/pages/NotFound";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "@/layouts/DashboardLayouts";

import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import HRdashboard from "@/pages/dashboard/HRdashboard";
import ManagerDashboard from "@/pages/dashboard/ManagerDashboard";
import EmployeeDashboard from "@/pages/dashboard/EmployeeDashboard";

import EmployeePage from "@/pages/EmployeePage";
import EmployeeDetailsPage from "@/pages/EmployeeDetailsPage";
import DepartmentPage from "@/pages/DepartmentPage";
import LeavePage from "@/pages/LeavePage";
import DocumentPage from "@/pages/DocumentPage";

import SettingsPage from "@/pages/SettingsPage";

import { useAuthStore } from "@/store/auth.store";
import { getDashboardRoute } from "@/utils/getDashboardRoute";
import MyDocumentsPage from "@/pages/MyDocumentsPage";
import DepartmentDetailsPage from "@/pages/DepartmentDetailsPage";
import MyProfile from "@/pages/MyProfile";

export const AppRoutes = () => {
   const token = useAuthStore((state) => state.token);
   const user = useAuthStore((state) => state.user);

   return (
      <Routes>
         <Route
            path="/"
            element={
               token && user ? (
                  <Navigate to={getDashboardRoute(user.role)} replace />
               ) : (
                  <Navigate to="/login" replace />
               )
            }
         />

         <Route path="/login" element={<LoginPage />} />

         <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>

               <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
               </Route>

               <Route element={<RoleRoute allowedRoles={["admin", "hr"]} />}>
                  <Route path="/departments" element={<DepartmentPage />} />
                  <Route path="/documents" element={<DocumentPage />} />
            
               </Route>

               <Route element={<RoleRoute allowedRoles={["admin", "hr", "manager"]} />}>
                  <Route path="/employees" element={<EmployeePage />} />
                  <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
                  <Route path="/leave" element={<LeavePage />} />
                  <Route path="/departments/:departmentId" element={<DepartmentDetailsPage/>}/>
               </Route>

               {/* HR + MANAGER + EMPLOYEE */}
               <Route
                  element={
                     <RoleRoute allowedRoles={["hr", "manager", "employee"]} />
                  }
               >
               </Route>

               <Route element={<RoleRoute allowedRoles={["admin", "hr", "manager", "employee"]} />}>
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<MyProfile />} />
               </Route>

               <Route element={<RoleRoute allowedRoles={["hr"]} />}>
                  <Route path="/hr/dashboard" element={<HRdashboard />} />
               </Route>

               <Route element={<RoleRoute allowedRoles={["manager"]} />}>
                  <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                   <Route path="/my-documents" element={<MyDocumentsPage />} />
               </Route>

               <Route element={<RoleRoute allowedRoles={["employee"]} />}>
                  <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                 
               </Route>

            </Route>
         </Route>

         <Route path="/not-found" element={<NotFound />} />
         <Route path="/unauthorized" element={<NotFound />} />
         <Route path="*" element={<NotFound />} />
      </Routes>
   );
};