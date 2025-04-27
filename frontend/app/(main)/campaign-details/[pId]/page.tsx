'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable, DataTableFilterMeta, DataTableFilterMetaData } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import { useStateContext } from '@/layout/context/statecontext';
import { Tooltip } from 'primereact/tooltip';
import { shortenAddress } from 'thirdweb/utils';
import { Image } from 'primereact/image';

interface PageProps {
    params: {
        pId: string;
    };
}

const formatNumber = (value: number): string => parseFloat(value.toFixed(3)).toString();

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
};

const calculateBarPercentage = (goal: string, raised: string): number => {
    const goalNum = parseFloat(goal);
    const raisedNum = parseFloat(raised);
    if (goalNum === 0) return 0;
    return Math.round((raisedNum * 100) / goalNum);
};

export default function CampaignDetailsPage({ params }: PageProps) {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const pId = parseInt(params.pId, 10);

    const { getCampaigns, getDonations, donate, withdrawFunds, claimRefund, cancelCampaign, address } = useStateContext();

    const [campaign, setCampaign] = useState<any>(null);
    const [donators, setDonators] = useState<
        {
            donator: string;
            donation: string;
            donationTimestamp: number;
            donationDate: Date;
        }[]
    >([]);
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showFullAddress, setShowFullAddress] = useState(false);

    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            donator: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            donation: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            donationDate: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            }
        });
        setGlobalFilterValue('');
    };

    useEffect(() => {
        initFilters();
    }, []);

    const fetchCampaign = async () => {
        try {
            const campaigns = await getCampaigns();
            const found = campaigns.find((c: any) => c.pId === pId);
            setCampaign(found);
        } catch (error) {
            console.error('fetchCampaign error:', error);
        }
    };

    const fetchDonators = async () => {
        if (!campaign) return;
        try {
            const data = await getDonations(campaign.pId);
            const list = data.addresses.map((addr: string, idx: number) => {
                const ts = parseInt(data.donationTimestamps[idx], 10);
                return {
                    donator: addr,
                    donation: data.donations[idx],
                    donationTimestamp: ts,
                    donationDate: new Date(ts * 1000)
                };
            });
            setDonators(list);
        } catch (error) {
            console.error('fetchDonators error:', error);
        }
    };

    useEffect(() => {
        if (!isNaN(pId)) {
            fetchCampaign();
        }
    }, [pId, address]);

    useEffect(() => {
        if (campaign) {
            fetchDonators();
        }
    }, [campaign]);

    if (!campaign) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth="1" fill="var(--surface-ground)" animationDuration=".5s" />
            </div>
        );
    }

    const currentTime = Date.now() / 1000;
    const deadlinePassed = currentTime > campaign.deadline;
    const targetReached = parseFloat(campaign.amountCollected) >= parseFloat(campaign.target);

    const isOwner = address && campaign.owner?.toLowerCase() === address?.toLowerCase();
    const canWithdraw = address && isOwner && targetReached && !campaign.cancelled && !campaign.fundsWithdrawn;
    const canCancel = address && isOwner && !campaign.cancelled && !campaign.fundsWithdrawn;
    const canClaimRefund = address && (campaign.cancelled || (deadlinePassed && !targetReached));
    const canDonate = address && !campaign.cancelled && !campaign.fundsWithdrawn && !deadlinePassed;

    const displayedAddress = showFullAddress ? campaign.owner : shortenAddress(campaign.owner);
    const barPercentage = calculateBarPercentage(campaign.target, campaign.amountCollected);
    const collectText = `${formatNumber(parseFloat(campaign.amountCollected))} / ${formatNumber(parseFloat(campaign.target))}`;

    const creationDate = formatDate(campaign.creationTime);
    const deadlineDate = formatDate(campaign.deadline);

    const handleDonate = async () => {
        try {
            setIsLoading(true);
            await donate(campaign.pId, amount);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Donation successful!',
                life: 3000
            });
            await fetchCampaign();
            await fetchDonators();
        } catch (error: any) {
            console.error('handleDonate error:', error);
            if (error.code === 4001) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Cancelled',
                    detail: 'The transaction was cancelled',
                    life: 3000
                });
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Donation failed!',
                    life: 3000
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdraw = async () => {
        try {
            setIsLoading(true);
            await withdrawFunds(campaign.pId);
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Withdraw successful!',
                life: 3000
            });
            await fetchCampaign();
        } catch (error: any) {
            console.error('handleWithdraw error:', error);
            if (error.code === 4001) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Cancelled',
                    detail: 'The transaction was cancelled',
                    life: 3000
                });
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Withdraw failed!',
                    life: 3000
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async () => {
        try {
            setIsLoading(true);
            await cancelCampaign(campaign.pId);
            toast.current?.show({
                severity: 'info',
                summary: 'Cancelled',
                detail: 'Campaign cancelled.',
                life: 3000
            });
            await fetchCampaign();
        } catch (error: any) {
            console.error('handleCancel error:', error);
            if (error.code === 4001) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Cancelled',
                    detail: 'The transaction was cancelled',
                    life: 3000
                });
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Cancel failed!',
                    life: 3000
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaimRefund = async () => {
        try {
            setIsLoading(true);
            await claimRefund(campaign.pId);
            toast.current?.show({
                severity: 'info',
                summary: 'Refunded',
                detail: 'Refund claimed.',
                life: 3000
            });
            await fetchCampaign();
        } catch (error: any) {
            console.error('handleClaimRefund error:', error);
            if (error.code === 4001) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Cancelled',
                    detail: 'The transaction was cancelled',
                    life: 3000
                });
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Refund failed!',
                    life: 3000
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const _filters = { ...filters };
        (_filters['global'] as DataTableFilterMetaData).value = e.target.value;
        setFilters(_filters);
        setGlobalFilterValue(e.target.value);
    };

    const clearFilter = () => {
        initFilters();
    };

    const renderHeader = () => {
        return (
            <div className="flex md:justify-content-between flex-column md:flex-row mb-3">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} className="w-full md:w-auto" />{' '}
                <div className="p-input-icon-left mt-2 md:mt-0 w-full md:w-auto">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search..." className="w-full" />
                </div>
            </div>
        );
    };

    const headerComponent = renderHeader();

    return (
        <>
            {isLoading && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(217, 217, 217, 0.48)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10000
                    }}
                >
                    <ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth="1" fill="var(--surface-ground)" animationDuration=".5s" />
                </div>
            )}

            <Toast ref={toast} position="top-right" />

            <div className="grid">
                <div className="col-12 md:px-1 px-0">
                    <div className="card md:px-4 px-1">
                        <div className="flex flex-column md:flex-row justify-content-between align-items-start p-2">
                            <h2 className="md:text-3xl text-xl font-bold m-0">{campaign.title || 'Campaign Title'}</h2>
                        </div>

                        <div className="mb-4 px-2 text-base text-500">Created date: {creationDate}</div>

                        <div className="align-items-center justify-content-between mb-2 w-full flex md:flex-row flex-column">
                            <div className="col-12 md:col-10 flex flex-column gap-2">
                                <div className="flex-grow-1 flex align-items-center justify-content-center overflow-hidden">
                                    <Image
                                        src={campaign.image}
                                        preview
                                        className="w-full"
                                        imageStyle={{
                                            objectFit: 'cover',
                                            width: '100%',
                                            height: '410px'
                                        }}
                                        alt="Campaign Image"
                                    />
                                </div>
                            </div>
                            <div className="row-gap-4 flex flex-column gap-2 md:col-2 col-12 align-items-center">
                                <Tooltip target=".deadline-block" mouseTrack mouseTrackTop={15} />
                                <Tooltip target=".collect-block" mouseTrack mouseTrackTop={15} />
                                <Tooltip target=".donors-block" mouseTrack mouseTrackTop={15} />
                                <div className="flex flex-column align-items-center text-center card m-0 w-full md:w-11 py-5 deadline-block" data-pr-tooltip="Deadline" data-pr-position="top" data-pr-mousetrack>
                                    <p className="font-bold m-0 text-lg">{deadlineDate}</p>
                                    <p className="text-lg mt-3 border-top-2">Deadline</p>
                                </div>
                                <div className="flex flex-column align-items-center text-center card m-0 w-full md:w-11 py-5 collect-block" data-pr-tooltip="Collected / Target (ETH)" data-pr-position="top" data-pr-mousetrack>
                                    <p className="font-bold m-0 text-lg">{collectText}</p>
                                    <p className="text-lg mt-3 border-top-2">Collected (ETH)</p>
                                </div>
                                <div className="flex flex-column align-items-center text-center card m-0 w-full md:w-11 py-5 donors-block" data-pr-tooltip="Total Donors" data-pr-position="top" data-pr-mousetrack>
                                    <div>
                                        <p className="font-bold m-0 text-lg">{donators.length}</p>
                                        <p className="text-lg mt-3 border-top-2">Donors</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-10 mb-4">
                            <ProgressBar value={barPercentage} style={{ height: '15px', borderRadius: '6px' }} />
                        </div>

                        <div className="mb-4 px-3">
                            <h3 className="text-xl font-bold mb-2">Description</h3>
                            <p>{campaign.description}</p>
                        </div>

                        <div className="mb-4 px-3">
                            <Tooltip target=".creator-block" mouseTrack mouseTrackTop={15} />
                            <h3 className="text-xl font-bold mb-2">Campaign Creator</h3>
                            <div className="flex align-items-center gap-2">
                                <i className="pi pi-wallet"></i>
                                <p className={`creator-block m-0 ownerText ${showFullAddress ? 'wrapAddress' : ''}`} data-pr-tooltip="Funds will be sent to this address." data-pr-position="right" data-pr-mousetrack>
                                    {showFullAddress ? campaign.owner : shortenAddress(campaign.owner)}
                                </p>
                                <Button icon="pi pi-eye" rounded text aria-label="Toggle full address" onClick={() => setShowFullAddress((prev) => !prev)} />
                            </div>

                            <style jsx>{`
                                .ownerText {
                                    /* по умолчанию обрезаем и одну строку */
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                .wrapAddress {
                                    /* при показе полного адреса переносим и разбиваем слово */
                                    overflow: visible;
                                    white-space: normal;
                                    word-break: break-all;
                                }
                            `}</style>
                        </div>

                        <div className="grid">
                            <div className="col-12 md:col-8">
                                <div className="card md:px-4 px-1">
                                    <h4 className="mb-3 p-2">Donators</h4>
                                    <DataTable
                                        value={donators}
                                        paginator
                                        rows={5}
                                        filters={filters}
                                        globalFilterFields={['donator', 'donation', 'donationDate']}
                                        header={headerComponent}
                                        emptyMessage="No donations yet. Be the first!"
                                        responsiveLayout="scroll"
                                        sortMode="multiple"
                                    >
                                        <Column field="donator" header="Donator Address" filter filterPlaceholder="Search Donator" style={{ minWidth: '12rem' }} sortable />
                                        <Column field="donation" header="Donation (ETH)" dataType="numeric" filter filterPlaceholder="Search Donation" style={{ minWidth: '10rem' }} sortable />
                                        <Column
                                            field="donationDate"
                                            header="Donation Date"
                                            dataType="date"
                                            filter
                                            filterElement={(options: ColumnFilterElementTemplateOptions) => (
                                                <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
                                            )}
                                            style={{ minWidth: '10rem' }}
                                            sortable
                                            body={(rowData) => formatDate(rowData.donationTimestamp)}
                                        />
                                    </DataTable>
                                </div>
                            </div>

                            <div className="col-12 md:col-4">
                                <div className="card p-3">
                                    {canDonate && (
                                        <>
                                            <h4 className="mb-3">Make a Donation</h4>
                                            <InputText type="number" placeholder="ETH 0.1" step="0.01" className="w-full mb-3" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                            <Button label="Donate" className="p-button-success w-full" onClick={handleDonate} />
                                        </>
                                    )}

                                    {canClaimRefund && (
                                        <>
                                            <h4 className="mb-3">Claim Your Refund</h4>
                                            <Button label="Claim Refund" className="p-button-info w-full" onClick={handleClaimRefund} />
                                        </>
                                    )}

                                    {canCancel && !canWithdraw && (
                                        <>
                                            <h4 className="mb-3">Manage Campaign</h4>
                                            <div className="flex">
                                                <Button label="Cancel Campaign" className="p-button-danger w-full" onClick={handleCancel} />
                                            </div>
                                        </>
                                    )}

                                    {!canCancel && canWithdraw && (
                                        <>
                                            <h4 className="mb-3">Manage Campaign</h4>
                                            <div className="flex">
                                                <Button label="Withdraw" className="p-button-success w-full" onClick={handleWithdraw} />
                                            </div>
                                        </>
                                    )}

                                    {canCancel && canWithdraw && (
                                        <>
                                            <h4 className="mb-3">Manage Campaign</h4>
                                            <div className="flex flex-column gap-2">
                                                <Button label="Withdraw" className="p-button-success w-full" onClick={handleWithdraw} />
                                                <Button label="Cancel Campaign" className="p-button-danger w-full" onClick={handleCancel} />
                                            </div>
                                        </>
                                    )}

                                    {!canDonate && !canClaimRefund && !canCancel && !canWithdraw && <p className="text-600">No actions available at this time.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
