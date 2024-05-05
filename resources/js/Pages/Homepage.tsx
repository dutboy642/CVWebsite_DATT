// App.jsx

import React, { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainContent from './MainContent';
import Sidebar from '@/Components/SideBarComponent';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import NavLink from '@/Components/NavLink';

export function Homepage({ children }: PropsWithChildren) {
    return (
        // <Sidebar children={children} />
        // <main>{children}</main>
        <div className="min-h-screen">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('home')} active={route().current('home')}>
                                    home
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

export default Homepage;
