import { Link, useLocation } from "react-router-dom";
import { breadcrumbRoutes } from "./breadcrumRoute";

export const Breadcrumb = () => {
    const { pathname } = useLocation();

    const route = breadcrumbRoutes.find((route) =>
        route.match.test(pathname)
    );

    if (!route) return null;

    return (
        <div className="flex items-center gap-2 text-sm">
            {route.breadcrumbs.map((item, index) => (
                <div key={item.label} className="flex items-center gap-2">
                    {index !== 0 && (
                        <span className="text-muted-foreground">
                            &gt;
                        </span>
                    )}

                    {item.path && item.path !== pathname ? (
                        <Link
                            to={item.path}
                            className="text-muted-foreground hover:text-primary"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-medium">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};