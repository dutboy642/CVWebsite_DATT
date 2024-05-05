// NavBar.jsx

import React, { ReactNode, PropsWithChildren } from 'react';
import Layout from "../Pages/Homepage"

import { Link, router, usePage } from '@inertiajs/react';
import NavLink from './NavLink';
interface LayoutProps {
    children: ReactNode;
}

export default function Sidebar({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>

    );
};
