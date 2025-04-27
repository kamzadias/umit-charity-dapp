'use client';
import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import type { Campaign } from '@/types';
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

const PersonalCampaigns = () => {
    const { getUserCampaigns } = useStateContext();
    const router = useRouter();

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[] | null>(null);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<1 | -1 | 0>(0);
    const [sortField, setSortField] = useState('');

    const [metrics, setMetrics] = useState({
        totalCampaigns: 0,
        campaignsReachedTarget: 0,
        totalAmountCollected: 0,
        totalTarget: 0,
        averageDonation: 0
    });

    const sortOptions = [
        { label: 'Deadline: Soonest', value: 'deadline' },
        { label: 'Deadline: Latest', value: '!deadline' }
    ];

    const fetchCampaigns = async () => {
        const data = await getUserCampaigns();
        setCampaigns(data);
        computeMetrics(data);
    };

    const computeMetrics = (campaigns: Campaign[]) => {
        const totalCampaigns = campaigns.length;
        let reachedTarget = 0;
        let sumCollected = 0;
        let sumTarget = 0;

        campaigns.forEach((campaign) => {
            const collected = parseFloat(campaign.amountCollected);
            const target = parseFloat(campaign.target);
            if (collected >= target) reachedTarget++;
            sumCollected += collected;
            sumTarget += target;
        });

        const averageDonation = totalCampaigns > 0 ? sumCollected / totalCampaigns : 0;

        setMetrics({
            totalCampaigns,
            campaignsReachedTarget: reachedTarget,
            totalAmountCollected: sumCollected,
            totalTarget: sumTarget,
            averageDonation
        });
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

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
        <div>
            <div className="grid mb-3">
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Total Campaigns</span>
                                <div className="text-900 font-medium text-xl">{metrics.totalCampaigns}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-chart-line text-blue-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Reached Target</span>
                                <div className="text-900 font-medium text-xl">{metrics.campaignsReachedTarget}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-check text-orange-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Collected / Target</span>
                                <div className="text-900 font-medium text-xl">
                                    {formatNumber(metrics.totalAmountCollected)} / {formatNumber(metrics.totalTarget)} ETH
                                </div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-dollar text-cyan-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Average Donation</span>
                                <div className="text-900 font-medium text-xl">{formatNumber(metrics.averageDonation)} ETH</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-credit-card text-purple-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-column md:flex-row md:justify-content-between gap-2 mb-3">
                <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Deadline" onChange={onSortChange} className="w-full md:w-3" />
                <span className="p-input-icon-left w-full md:w-3">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onFilter} placeholder="Search by Title" className="w-full" />
                </span>
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value as 'list' | 'grid')} />
            </div>
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
                            className="mb-1 text-sm"
                            style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                lineHeight: '1.5em',
                                WebkitLineClamp: 3,
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

                        <div className="flex align-items-center mt-2 mb-3" style={{ width: '100%', overflow: 'hidden' }}>
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

                        <Button label="View Details" onClick={() => handleNavigate(campaign)} className="p-button-sm p-button-outlined w-full md:w-auto md:mt-0" />
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
        return layoutType === 'list' ? dataviewListItem(campaign) : dataviewGridItem(campaign);
    };

    const handleNavigate = (campaign: Campaign) => {
        router.push(`/campaign-details/${campaign.pId}`);
    };

    return (
        <div className="grid">
            <div className="col-12 md:px-1 px-0">
                <div className="card md:px-2 px-1">
                    <h2 className="md:text-2xl text-xl px-3">Your campaigns</h2>
                    <DataView value={filteredCampaigns || campaigns} layout={layout} paginator rows={6} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataViewHeader} emptyMessage="No campaigns found." />
                </div>
            </div>
        </div>
    );
};

export default PersonalCampaigns;
