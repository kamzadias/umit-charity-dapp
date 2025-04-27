'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { PrimeReactContext } from 'primereact/api';
import { LayoutState, ChildContainerProps, LayoutConfig, LayoutContextProps } from '@/types';

const defaultConfig: LayoutConfig = {
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
    scale: 14
};

const defaultState: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
};

export const LayoutContext = createContext({} as LayoutContextProps);

export const LayoutProvider = ({ children }: ChildContainerProps) => {
    const { changeTheme, setRipple } = useContext(PrimeReactContext);

    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('layoutConfig');
            if (saved) {
                try {
                    return JSON.parse(saved) as LayoutConfig;
                } catch (e) {
                    console.warn('Failed to parse layoutConfig from localStorage', e);
                }
            }
        }
        return defaultConfig;
    });

    const [layoutState, setLayoutState] = useState<LayoutState>(defaultState);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('layoutConfig', JSON.stringify(layoutConfig));
        }
    }, [layoutConfig]);

    useEffect(() => {
        setRipple?.(layoutConfig.ripple);
        changeTheme?.( '', layoutConfig.theme, 'theme-css');
    }, []);

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === 'overlay') {
            setLayoutState((prev) => ({
                ...prev,
                overlayMenuActive: !prev.overlayMenuActive
            }));
        }

        if (window.innerWidth > 991) {
            setLayoutState((prev) => ({
                ...prev,
                staticMenuDesktopInactive: !prev.staticMenuDesktopInactive
            }));
        } else {
            setLayoutState((prev) => ({
                ...prev,
                staticMenuMobileActive: !prev.staticMenuMobileActive
            }));
        }
    };

    const showProfileSidebar = () => {
        setLayoutState((prev) => ({
            ...prev,
            profileSidebarVisible: !prev.profileSidebarVisible
        }));
    };

    const value: LayoutContextProps = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        showProfileSidebar
    };

    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};
