'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';

import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { StateContextProvider } from '@/layout/context/statecontext';
import { ThirdwebProvider } from 'thirdweb/react';
import { useEffect } from 'react';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    useEffect(() => {
        const stored = localStorage.getItem('chosenTheme');
        const themeLink = document.getElementById('theme-css') as HTMLLinkElement | null;
        if (stored && themeLink) {
            themeLink.href = `/themes/${stored}/theme.css`;
        }
    }, []);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <ThirdwebProvider>
                    <PrimeReactProvider>
                        <StateContextProvider>
                            <LayoutProvider>{children}</LayoutProvider>
                        </StateContextProvider>
                    </PrimeReactProvider>
                </ThirdwebProvider>
            </body>
        </html>
    );
}
