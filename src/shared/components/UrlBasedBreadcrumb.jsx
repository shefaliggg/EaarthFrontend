import { Link, useLocation } from 'react-router-dom';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from '@/shared/components/ui/breadcrumb';
import { useState } from 'react';
import { BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

export default function UrlBreadcrumbs() {
    const { pathname } = useLocation();

    function prettifySegment(seg) {
        return seg
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    const segments = pathname.split('/');
    console.log('Segments:', segments);
    let accumulatedPath = '';
    const crumbs = segments.map((segment, index) => {
        const isRoot = index === 0 && segment === '';
        if (isRoot) {
            return {
                key: 'home',
                label: 'Home',
                href: '/',
                isLast: segments.length === 1,
            };
        }

        if (segment === '') accumulatedPath = '/';
        else if (accumulatedPath === '/' && segment === "home") return null; // skip 'home' segment at root
        else if (accumulatedPath === '/' && segment !== "home") accumulatedPath = accumulatedPath + segment;
        else accumulatedPath = accumulatedPath + '/' + segment;

        // Decide label
        const label = (() => {
            return prettifySegment(segment);
        })()

        const isLast = index === segments.length - 1;

        return {
            key: `${segment}-${index}`,
            label,
            href: accumulatedPath,
            isLast,
        };
    });

    const filtered = crumbs.filter(c => c.label && c.label !== '');

    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <Breadcrumb>
                <BreadcrumbList>
                    {filtered.map((c) => (
                        <BreadcrumbItem key={c.key}>
                            {c.isLast ? (
                                <BreadcrumbPage>{c.label}</BreadcrumbPage>
                            ) : (
                                <>

                                    <BreadcrumbLink asChild>
                                        <Link to={c.href}>
                                            {c.label}
                                        </Link>
                                    </BreadcrumbLink>
                                    <BreadcrumbSeparator />
                                </>

                            )}
                        </BreadcrumbItem>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </nav>
    );
}