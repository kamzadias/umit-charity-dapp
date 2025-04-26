/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import { useActiveAccount } from 'thirdweb/react';

const AppMenu = () => {
    const activeAccount = useActiveAccount();
    const address = activeAccount?.address;

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Campaign Management',
            items: [
                { label: 'Create a Campaign', icon: 'pi pi-fw pi-id-card', to: '/create-campaign' },
                { label: 'All Campaigns', icon: 'pi pi-fw pi-id-card', to: '/display-campaigns' },
                ...(address ? [{ label: 'My Campaigns', icon: 'pi pi-fw pi-id-card', to: '/personal-campaigns' }] : [])
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
