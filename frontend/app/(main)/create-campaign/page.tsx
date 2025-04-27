'use client';
import React, { useState, useRef } from 'react';
import { useStateContext } from '@/layout/context/statecontext';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Image } from 'primereact/image';

const checkIfImage = (url: string, callback: (exists: boolean) => void) => {
    const img = new window.Image();
    img.src = url;
    if (img.complete) {
        callback(true);
        return;
    }
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
};

const CreateCampaign = () => {
    const { createCampaign } = useStateContext();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef<Toast>(null);

    const [form, setForm] = useState<{
        title: string;
        description: string;
        target: string;
        deadline: Date | null;
        image: string;
    }>({
        title: '',
        description: '',
        target: '',
        deadline: null,
        image: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
        setForm((prev) => ({ ...prev, [fieldName]: e.target.value }));
    };

    const handleDateChange = (e: any) => {
        setForm((prev) => ({ ...prev, deadline: e.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        checkIfImage(form.image, async (exists: boolean) => {
            if (exists) {
                setIsLoading(true);
                try {
                    await createCampaign({
                        title: form.title,
                        description: form.description,
                        target: form.target,
                        deadline: form.deadline ? form.deadline.toISOString() : '',
                        image: form.image
                    });
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Campaign created successfully',
                        life: 3000
                    });
                    setForm({ title: '', description: '', target: '', deadline: null, image: '' });
                } catch (error: any) {
                    console.error('Error creating campaign:', error);
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
                            detail: 'Campaign creation failed',
                            life: 3000
                        });
                    }
                    toast.current?.show({});
                }
                setIsLoading(false);
            } else {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Invalid Image',
                    detail: 'Please provide a valid image URL',
                    life: 3000
                });
                setForm((prev) => ({ ...prev, image: '' }));
            }
        });
    };

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
            <div className="grid align-items-stretch justify-content-center md:px-6">
                <div className="col-12 md:col-7 flex">
                    <div className="card shadow-2 border-round-xl flex-grow-1 flex flex-column md:p-8">
                        <h2 className="text-2xl font-bold m-0 md:text-left text-center">Create a campaign</h2>
                        <p className="text-600 mt-4 mb-6 md:text-left text-center md:text-lg text-base">Our team would love to hear from you!</p>
                        <form onSubmit={handleSubmit} className="flex-grow-1">
                            <div className="field">
                                <label htmlFor="title">Campaign Title</label>
                                <InputText id="title" className="w-full" value={form.title} onChange={(e) => handleChange(e, 'title')} required placeholder="Campaign Title" />
                            </div>
                            <div className="formgrid grid">
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="target">Goal (ETH)</label>
                                    <InputText id="target" className="w-full" placeholder="e.g., 1.0" value={form.target} onChange={(e) => handleChange(e, 'target')} required />
                                </div>
                                <div className="field col-12 md:col-6">
                                    <label htmlFor="deadline">Deadline</label>
                                    <Calendar id="deadline" showIcon showButtonBar selectionMode="single" className="w-full" placeholder="Choose" value={form.deadline} dateFormat="dd-mm-yy" onChange={handleDateChange} required />
                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="description">Description</label>
                                <InputTextarea id="description" className="w-full" placeholder="Enter your story" value={form.description} onChange={(e) => handleChange(e, 'description')} rows={5} required />
                            </div>
                            <div className="flex align-items-center p-4 bg-primary border-round-md my-4">
                                <i className="pi pi-wallet md:text-2xl text-xl text-white mr-3" />
                                <h4 className="font-bold text-white md:text-lg text-base m-0">You will receive 100% of the collected amount</h4>
                            </div>
                            <div className="field">
                                <label htmlFor="image">Campaign Image URL</label>
                                <InputText id="image" className="w-full" placeholder="Paste Image URL" value={form.image} onChange={(e) => handleChange(e, 'image')} required />
                            </div>
                            <div className="flex align-items-center justify-content-center mt-4">
                                <Button type="submit" className="bg-primary w-full p-3 text-lg" label="Create Campaign" />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-12 md:col-5 flex">
                    <div className="flex-grow-1 flex align-items-center justify-content-center overflow-hidden">
                        <Image src="/demo/images/galleria/galleria16.png" imageStyle={{ objectFit: 'cover', width: '100%', height: '100%' }} alt="Campaign Image" preview />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateCampaign;
