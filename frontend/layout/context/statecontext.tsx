'use client';
import React, { useContext, createContext, ReactNode, useState, useEffect } from 'react';
import { parseEther, formatEther } from 'ethers';
import { createThirdwebClient, getContract, prepareContractCall, readContract } from 'thirdweb';
import { sepolia } from 'thirdweb/chains';
import { useSendAndConfirmTransaction, useActiveAccount } from 'thirdweb/react';
import { StateContextProps, CampaignForm, Campaign, PlatformStats } from '@/types';

const StateContext = createContext<StateContextProps | undefined>(undefined);

const CONTRACT_ADDRESS = '0x57553d5715bfc7a22232Cd62b7Dc83DE9a51F5aE';

export const StateContextProvider = ({ children }: { children: ReactNode }) => {
    const [address, setAddress] = useState<string | undefined>();

    const client = createThirdwebClient({
        clientId: 'a6a895c6448d55be7502d02cdb3f72d8'
    });

    const contract = getContract({
        client,
        chain: sepolia,
        address: CONTRACT_ADDRESS
    });

    const activeAccount = useActiveAccount();
    const { mutateAsync: sendTx } = useSendAndConfirmTransaction();

    useEffect(() => {
        if (activeAccount?.address) {
            setAddress(activeAccount.address);
        }
    }, [activeAccount]);

    /**
     * Создание кампании.
     * Solidity: createCampaign(address _owner, string _title, string _description, uint256 _target, uint256 _deadline, string _image) returns (uint256)
     */
    const createCampaign = async (form: CampaignForm): Promise<void> => {
        if (!activeAccount) {
            console.error('No active account found. Please connect your wallet.');
            return;
        }
        try {
            const transaction = prepareContractCall({
                contract,
                method: 'function createCampaign(address _owner, string _title, string _description, uint256 _target, uint256 _deadline, string _image) returns (uint256)',
                params: [activeAccount.address, form.title, form.description, parseEther(form.target), BigInt(Math.floor(new Date(form.deadline).getTime() / 1000)), form.image]
            });
            const data = await sendTx(transaction);
            console.log('Campaign created successfully: ', data);
        } catch (error) {
            console.error('Campaign creation failed: ', error);
            throw error;
        }
    };

    /**
     * Получение списка кампаний.
     * Solidity: getCampaigns() view returns (CampaignView[])
     */
    const getCampaigns = async (): Promise<Campaign[]> => {
        try {
            const data = await readContract({
                contract,
                method: 'function getCampaigns() view returns ((address owner, string title, string description, uint256 target, uint256 deadline, uint256 amountCollected, string image, bool fundsWithdrawn, bool cancelled, uint256 creationTime, address[] donators, uint256[] donations, uint256[] donationTimestamps)[])',
                params: []
            });
            const parsedCampaigns: Campaign[] = (data as any[]).map((campaign, i) => ({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                target: formatEther(campaign.target.toString()),
                deadline: Number(campaign.deadline),
                amountCollected: formatEther(campaign.amountCollected.toString()),
                image: campaign.image,
                fundsWithdrawn: campaign.fundsWithdrawn,
                cancelled: campaign.cancelled,
                creationTime: Number(campaign.creationTime),
                pId: i
            }));
            return parsedCampaigns;
        } catch (error) {
            console.error('getCampaigns error:', error);
            return [];
        }
    };

    const getUserCampaigns = async (): Promise<Campaign[]> => {
        const allCampaigns = await getCampaigns();
        return allCampaigns.filter((campaign) => campaign.owner.toLowerCase() === address?.toLowerCase());
    };

    /**
     * Донат в кампанию.
     * Solidity: donateToCampaign(uint256 _id) payable
     */
    const donate = async (pId: number, amount: string): Promise<any> => {
        if (!activeAccount) {
            console.error('No active account found. Please connect your wallet.');
            return;
        }
        try {
            const transaction = prepareContractCall({
                contract,
                method: 'function donateToCampaign(uint256 _id) payable',
                params: [BigInt(pId)],
                value: parseEther(amount)
            });
            const data = await sendTx(transaction);
            console.log('Donation successful: ', data);
            return data;
        } catch (error) {
            console.error('Donation failed: ', error);
            throw error;
        }
    };

    /**
     * Получение донатов с временными метками.
     * Solidity: getDonators(uint256 _id) view returns (address[], uint256[], uint256[])
     */
    const getDonations = async (
        pId: number
    ): Promise<{
        addresses: string[];
        donations: string[];
        donationTimestamps: string[];
    }> => {
        try {
            const data = await readContract({
                contract,
                method: 'function getDonators(uint256 _id) view returns (address[], uint256[], uint256[])',
                params: [BigInt(pId)]
            });
            const addresses = data[0] as string[];
            const donations = (data[1] as any[]).map((don: any) => formatEther(don.toString()));
            const donationTimestamps = (data[2] as any[]).map((ts: any) => ts.toString());
            return { addresses, donations, donationTimestamps };
        } catch (error) {
            console.error('getDonations error:', error);
            return { addresses: [], donations: [], donationTimestamps: [] };
        }
    };

    /**
     * Вывод средств.
     * Solidity: withdrawFunds(uint256 _id)
     */
    const withdrawFunds = async (pId: number): Promise<any> => {
        if (!activeAccount) {
            console.error('No active account found. Please connect your wallet.');
            return;
        }
        try {
            const transaction = prepareContractCall({
                contract,
                method: 'function withdrawFunds(uint256 _id)',
                params: [BigInt(pId)]
            });
            const data = await sendTx(transaction);
            console.log('Funds withdrawn successfully: ', data);
            return data;
        } catch (error) {
            console.error('Withdrawal failed: ', error);
            throw error;
        }
    };

    /**
     * Запрос возврата средств.
     * Solidity: claimRefund(uint256 _id)
     */
    const claimRefund = async (pId: number): Promise<any> => {
        if (!activeAccount) {
            console.error('No active account found. Please connect your wallet.');
            return;
        }
        try {
            const transaction = prepareContractCall({
                contract,
                method: 'function claimRefund(uint256 _id)',
                params: [BigInt(pId)]
            });
            const data = await sendTx(transaction);
            console.log('Refund claimed successfully: ', data);
            return data;
        } catch (error) {
            console.error('Refund failed: ', error);
            throw error;
        }
    };

    /**
     * Отмена кампании.
     * Solidity: cancelCampaign(uint256 _id)
     */
    const cancelCampaign = async (pId: number): Promise<any> => {
        if (!activeAccount) {
            console.error('No active account found. Please connect your wallet.');
            return;
        }
        try {
            const transaction = prepareContractCall({
                contract,
                method: 'function cancelCampaign(uint256 _id)',
                params: [BigInt(pId)]
            });
            const data = await sendTx(transaction);
            console.log('Campaign cancelled successfully: ', data);
            return data;
        } catch (error) {
            console.error('Cancel campaign failed: ', error);
            throw error;
        }
    };

    /**
     * Получение глобальной статистики платформы.
     * Solidity: getPlatformStats() view returns (uint256 totalCampaigns, uint256 totalAmountCollected, uint256 totalDonationsCount, uint256 averageDonation, uint256 campaignsReachedTarget)
     */
    const getPlatformStats = async (): Promise<PlatformStats> => {
        try {
            const data = await readContract({
                contract,
                method: 'function getPlatformStats() view returns (uint256, uint256, uint256, uint256, uint256)',
                params: []
            });
            return {
                totalCampaigns: Number(data[0]),
                totalAmountCollected: Number(data[1]),
                totalDonationsCount: Number(data[2]),
                averageDonation: Number(data[3]),
                campaignsReachedTarget: Number(data[4])
            };
        } catch (error) {
            console.error('getPlatformStats error:', error);
            return {
                totalCampaigns: 0,
                totalAmountCollected: 0,
                totalDonationsCount: 0,
                averageDonation: 0,
                campaignsReachedTarget: 0
            };
        }
    };

    const value: StateContextProps = {
        client,
        address,
        contract,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        withdrawFunds,
        claimRefund,
        cancelCampaign,
        getPlatformStats
    };

    return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
};

export const useStateContext = (): StateContextProps => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error('useStateContext must be used within a StateContextProvider');
    }
    return context;
};
