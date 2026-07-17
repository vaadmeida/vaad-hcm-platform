import { useAuthStore } from "@/store/auth.store"
import { Navigate, Outlet } from "react-router-dom"

interface RoleRouteProps {
    allowedRoles: ("admin" | "hr" | "manager" | "employee")[]
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {

    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)

    // User is not authenticated
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if(!allowedRoles.includes(user.role)){
        return <Navigate to="/unauthorized" replace />;   
    }

    return <Outlet/>

}

export default RoleRoute
