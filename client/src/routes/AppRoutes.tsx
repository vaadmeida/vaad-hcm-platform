import LoginPage from "@/pages/auth/LoginPage"
import NotFound from "@/pages/NotFound"
import { Navigate, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import RoleRoute from "./RoleRoute"
import AdminDashboard from "@/pages/dashboard/AdminDashboard"
import ManagerDashboard from "@/pages/dashboard/ManagerDashboard"
import EmployeeDashboard from "@/pages/dashboard/EmployeeDashboard"
import { useAuthStore } from "@/store/auth.store"
import { getDashboardRoute } from "@/utils/getDashboardRoute"
import DashboardLayout from "@/layouts/DashboardLayouts"
import EmployeePage from "@/pages/EmployeePage"
import LeavePage from "@/pages/LeavePage"
import DepartmentPage from "@/pages/DepartmentPage"
import DocumentPage from "@/pages/DocumentPage"
import ReportPage from "@/pages/ReportPage"
import SettingsPage from "@/pages/SettingsPage"
import EmployeeDetailsPage from "@/pages/EmployeeDetailsPage"
import HRdashboard from "@/pages/dashboard/HRdashboard"
import MyLeavePage from "@/pages/MyLeavePage"


export const AppRoutes = () => {

   const token = useAuthStore(state => state.token)
   const user = useAuthStore(state => state.user)

   return (
      <Routes>

         <Route path="/" element={
            token && user ? (
               <Navigate to={getDashboardRoute(user.role)} replace />
            ) : (
               <Navigate to="/login" replace />
            )
         } />


         {/* Public Routes */}
         <Route path="/login" element={<LoginPage />} />
         <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>

               {/* ADMIN */}
               <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
               </Route>

               {/* ADMIN + HR */}
               <Route element={<RoleRoute allowedRoles={["admin", "hr"]} />}>
                  <Route path="/employees" element={<EmployeePage />} />
                  <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
                  <Route path="/departments" element={<DepartmentPage />} />
                  <Route path="/leave" element={<LeavePage />} />
                  <Route path="/documents" element={<DocumentPage />} />
                    <Route path="/reports" element={<ReportPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
               </Route>

               {/* HR */}
               <Route element={<RoleRoute allowedRoles={["hr"]} />}>
                  <Route path="/hr/dashboard" element={<HRdashboard />} />
                  <Route path="/my-leave" element={<MyLeavePage/>}/>
               </Route>

               {/* MANAGER */}
               <Route element={<RoleRoute allowedRoles={["manager"]} />}>
                  <Route path="/manager/dashboard" element={<ManagerDashboard />} />
               </Route>

               {/* EMPLOYEE */}
               <Route element={<RoleRoute allowedRoles={["employee"]} />}>
                  <Route
                     path="/employee/dashboard"
                     element={<EmployeeDashboard />}
                  />
               </Route>
            </Route>
         </Route>



         {/*    Other Route     */}
         <Route path="/not-found" element={<NotFound />} />
         <Route path="/unauthorized" element={<NotFound />} />
         <Route path="*" element={<NotFound />} />

      </Routes>
   )
}