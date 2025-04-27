'use client';
import React, { useState, useEffect, useContext } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import type { Campaign, Demo } from '@/types';
import { useRouter } from 'next/navigation';
import { useStateContext } from '@/layout/context/statecontext';

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
};

const formatNumber = (value: number): string => parseFloat(value.toFixed(3)).toString();

const DisplayCampaigns = () => {
    const { getCampaigns, address, contract } = useStateContext();
    const router = useRouter();

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[] | null>(null);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<1 | -1 | 0>(0);
    const [sortField, setSortField] = useState('');

    const sortOptions = [
        { label: 'Deadline: Soonest', value: 'deadline' },
        { label: 'Deadline: Latest', value: '!deadline' }
    ];

    const fetchCampaigns = async () => {
        const data = await getCampaigns();
        setCampaigns(data);
    };

    useEffect(() => {
        if (contract) fetchCampaigns();
    }, [address, contract]);

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);

        if (!value) {
            setFilteredCampaigns(null);
        } else {
            const filtered = campaigns.filter((c) => c.title.toLowerCase().includes(value.toLowerCase()));
            setFilteredCampaigns(filtered);
        }
    };

    const onSortChange = (event: DropdownChangeEvent) => {
        const value = event.value;
        setSortKey(value);

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1));
        } else {
            setSortOrder(1);
            setSortField(value);
        }
    };

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2 mb-3">
            <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Deadline" onChange={onSortChange} className="w-full md:w-3" />
            <span className="p-input-icon-left w-full md:w-3">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onFilter} placeholder="Search by Title" className="w-full" />
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value as 'list' | 'grid')} />
        </div>
    );

    const dataviewListItem = (campaign: Campaign) => {
        const daysLeftNumber = (new Date(campaign.deadline * 1000).getTime() - Date.now()) / (1000 * 3600 * 24);
        const remainingDisplay = daysLeftNumber < 0 ? formatDate(campaign.creationTime) : daysLeftNumber.toFixed(0);
        const label = daysLeftNumber < 0 ? 'Expired' : 'Days Left';

        return (
            <div className="col-12">
                <div className="flex flex-column align-items-center md:flex-row p-3 mb-2 w-full box-border">
                    <img src={campaign.image} alt="campaign" className="w-full md:w-4 lg:w-3 border-round shadow-2 mb-3 md:mb-0" style={{ height: '200px', objectFit: 'cover' }} />

                    <div className="flex-1 w-full md:pl-6 flex flex-column align-items-start mt-2">
                        <h4
                            className="text-lg font-bold mb-2"
                            style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {campaign.title}
                        </h4>

                        <p
                            className="mb-3 text-sm"
                            style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                lineHeight: '1.5em',
                                WebkitBoxOrient: 'vertical',
                                minHeight: 'calc(1.5em * 3)'
                            }}
                        >
                            {campaign.description}
                        </p>

                        <div className="text-sm">Goal: {formatNumber(parseFloat(campaign.target))} ETH</div>
                        <div className="text-sm my-2">Collected: {formatNumber(parseFloat(campaign.amountCollected))} ETH</div>
                        <div className="text-sm">
                            {label}: {remainingDisplay}
                        </div>

                        <div className="flex align-items-center my-2" style={{ width: '100%', overflow: 'hidden' }}>
                            <span
                                className="text-sm"
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Owner: {campaign.owner}
                            </span>
                        </div>

                        <Button label="View Details" onClick={() => handleNavigate(campaign)} className="p-button-sm p-button-outlined w-full md:w-auto mt-3 md:mt-0" />
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (campaign: Campaign) => {
        const daysLeftNumber = (new Date(campaign.deadline * 1000).getTime() - Date.now()) / (1000 * 3600 * 24);
        const remainingDisplay = daysLeftNumber < 0 ? formatDate(campaign.creationTime) : daysLeftNumber.toFixed(0);
        const label = daysLeftNumber < 0 ? 'Expired' : 'Days Left';

        return (
            <div className="align-items-stretch col-12 md:col-6 lg:col-4 flex">
                <div className="md:m-2 m-0 flex flex-column w-full">
                    <div className="p-3 shadow-1 flex flex-column" style={{ cursor: 'pointer', height: '100%' }} onClick={() => handleNavigate(campaign)}>
                        <img src={campaign.image} alt="campaign" className="w-full border-round mb-3" style={{ height: '200px', objectFit: 'cover' }} />
                        <div className="flex-1 w-full flex flex-column align-items-start mt-2">
                            <h4
                                className="text-lg font-bold m-0"
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical'
                                }}
                            >
                                {campaign.title}
                            </h4>
                            <p
                                className="m-0 text-sm text-700 mt-2"
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: '1.5em',
                                    minHeight: 'calc(1.5em * 3)'
                                }}
                            >
                                {campaign.description}
                            </p>
                            <div className="flex md:justify-content-between mt-3 text-sm flex-column md:flex-row w-full">
                                <div>
                                    <span className="font-semibold">{formatNumber(parseFloat(campaign.amountCollected))} ETH</span>
                                    <p className="m-0">Raised of {formatNumber(parseFloat(campaign.target))}</p>
                                </div>
                                <div className="md:my-0 my-2">
                                    <span className="font-semibold">{remainingDisplay}</span>
                                    <p className="m-0 md:text-right">{label}</p>
                                </div>
                            </div>
                            <div className="flex align-items-center my-2" style={{ width: '100%', overflow: 'hidden' }}>
                                <i className="pi pi-user mr-2" />
                                <span
                                    className="text-sm"
                                    style={{
                                        flex: 1,
                                        minWidth: 0,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Owner: {campaign.owner}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (campaign: Campaign, layoutType: 'grid' | 'list') => {
        if (!campaign) return null;
        if (layoutType === 'list') return dataviewListItem(campaign);
        if (layoutType === 'grid') return dataviewGridItem(campaign);
    };

    const handleNavigate = (campaign: Campaign) => {
        router.push(`/campaign-details/${campaign.pId}`);
    };

    const bottomThreeCampaigns = [...campaigns]
        .filter((campaign) => {
            const daysLeftNumber = (new Date(campaign.deadline * 1000).getTime() - Date.now()) / (1000 * 3600 * 24);
            return daysLeftNumber >= 0 && !campaign.cancelled;;
        })
        .sort((a, b) => parseFloat(a.amountCollected) - parseFloat(b.amountCollected))
        .slice(0, 3);
    return (
        <div className="grid">
            <div className="col-12 md:px-1 px-0">
                <div className="card md:px-2 px-1">
                    <h2 className="md:text-2xl text-xl px-3">Campaigns</h2>
                    <DataView value={filteredCampaigns || campaigns} layout={layout} paginator rows={6} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader} emptyMessage="No campaigns found." />
                </div>
            </div>
            <div className="col-12 md:px-1 px-0 mt-5">
                <div className="card md:px-4 px-3">
                    <h2 className="md:text-2xl text-xl font-bold mb-2">Need Support</h2>
                    <p className="mb-4">These campaigns have collected the least so far. A small donation can make a big difference!</p>

                    <div className="grid align-items-stretch">
                        {bottomThreeCampaigns.length > 0 ? (
                            bottomThreeCampaigns.map((campaign) => {
                                const daysLeftNumber = (new Date(campaign.deadline * 1000).getTime() - Date.now()) / (1000 * 3600 * 24);
                                const remainingDisplay = daysLeftNumber < 0 ? formatDate(campaign.creationTime) : daysLeftNumber.toFixed(0);
                                const label = daysLeftNumber < 0 ? 'Expired' : 'Days Left';

                                return (
                                    <div className="col-12 md:px-1 px-0 md:col-4 md:mb-0 mb-2 flex align-items-stretch" key={campaign.pId}>
                                        <div className="p-3 border-round shadow-2 flex flex-column w-full" style={{ borderTop: '4px solid #1976d2' }}>
                                            <h4
                                                className="mt-2 mb-1 font-bold text-lg"
                                                style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {campaign.title}
                                            </h4>

                                            <p className="mb-3 text-sm description">{campaign.description}</p>
                                            <style jsx>{`
                                                .description {
                                                    display: -webkit-box;
                                                    -webkit-line-clamp: 3;
                                                    -webkit-box-orient: vertical;
                                                    overflow: hidden;
                                                    line-height: 1.5em;
                                                    min-height: calc(1.5em * 3);
                                                }
                                            `}</style>

                                            <div className="flex align-items-center mb-3">
                                                <img src={campaign.image} alt="Owner" className="mr-2 border-circle" style={{ width: '35px', height: '35px', objectFit: 'cover' }} />
                                                <div className="flex flex-column">
                                                    <span className="text-sm text-900">
                                                        {label}: <strong>{remainingDisplay}</strong>
                                                    </span>
                                                    <span className="text-xs text-600">Collected: {formatNumber(parseFloat(campaign.amountCollected))} ETH</span>
                                                </div>
                                            </div>

                                            <div className="flex align-items-center mb-3">
                                                <i className="pi pi-user mr-2" />
                                                <span className="ownerText text-sm">Owner: {campaign.owner}</span>
                                            </div>

                                            <style jsx>{`
                                                @media (max-width: 767px) {
                                                    .ownerText {
                                                        overflow: hidden;
                                                        text-overflow: ellipsis;
                                                        white-space: nowrap;
                                                    }
                                                }
                                            `}</style>

                                            <div className="mt-auto pt-2">
                                                <Button label="View" onClick={() => handleNavigate(campaign)} className="p-button-outlined p-button-sm" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-12">
                                <div className="p-5 border-round shadow-2 text-center">
                                    <p className="text-600 mb-3">Currently no campaigns need support</p>
                                    <Button label="Create your own campaign" onClick={() => router.push('/create-campaign')} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisplayCampaigns;
