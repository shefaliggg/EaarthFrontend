import { Link, useLocation } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { prettifySegment } from "../config/utils";

export default function UrlBreadcrumbs() {
    const { pathname } = useLocation();

    const segments = pathname.split("/").filter(Boolean);

    // Build crumbs
    let accumulatedPath = "";
    const crumbs = [
        {
            key: "home",
            label: "Home",
            href: "/home",
            isLast: segments.length === 0,
        },
        ...segments.map((segment, index) => {
            accumulatedPath += `/${segment}`;

            return {
                key: `${segment}-${index}`,
                label: prettifySegment(segment),
                href: accumulatedPath,
                isLast: index === segments.length - 1,
            };
        }),
    ];
    const filtered = crumbs.filter(c => {
        if (pathname === '/home' && c.label === 'Home' && !c.isLast) return false;
        return c.label && c.label !== '';
    });

    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <Breadcrumb>
                <BreadcrumbList>
                    {filtered.map((c, index) => (
                        <div key={c.key} className="flex items-center">
                            <BreadcrumbItem>
                                {c.isLast ? (
                                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link to={c.href}>{c.label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {!c.isLast && <BreadcrumbSeparator />}
                        </div>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </nav>
    );
}
