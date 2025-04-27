/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { Button } from 'primereact/button';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Accordion, AccordionTab } from 'primereact/accordion';
import YouTube from 'react-youtube';
import { useStateContext } from '@/layout/context/statecontext';
import { formatEther } from 'ethers';

const Dashboard = () => {
    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef<HTMLElement | null>(null);

    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };

    const videoOptions = {
        height: '500',
        width: '1080',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0
        }
    };

    const { getPlatformStats } = useStateContext();
    const [platformStats, setPlatformStats] = useState<any>(null);

    useEffect(() => {
        async function fetchStats() {
            const stats = await getPlatformStats();
            setPlatformStats(stats);
        }
        fetchStats();
    }, [getPlatformStats]);

    const formattedTotalAmount = platformStats ? parseFloat(formatEther(platformStats.totalAmountCollected.toString())).toFixed(2) : '0';

    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
                <div className="hero">
                    <style jsx>{`
                        .hero {
                            position: relative;
                            overflow: hidden;
                            height: 43rem;
                        }
                        @media (max-width: 1023px) {
                            .hero {
                                height: 30rem;
                            }
                        }
                        @media (max-width: 639px) {
                            .hero {
                                height: 35rem;
                            }
                        }

                        .hero video {
                            position: absolute;
                            inset: 0;
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }

                        .hero .overlay {
                            position: absolute;
                            inset: 0;
                            background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));
                            z-index: 1;
                        }

                        .hero .brand {
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            padding: 40px 50px;
                            z-index: 2;
                        }
                        @media (max-width: 1023px) {
                            .hero .brand {
                                padding: 40px 40px;
                            }
                        }
                        @media (max-width: 639px) {
                            .hero .brand {
                                padding: 40px 30px;
                                text-align: center;
                            }
                        }

                        .hero .brand .logo {
                            margin: 0;
                            font-size: 2rem;
                        }
                        @media (max-width: 1023px) {
                            .hero .brand .logo {
                                font-size: 1.75rem;
                            }
                        }
                        @media (max-width: 639px) {
                            .hero .brand .logo {
                                font-size: 1.5rem;
                            }
                        }

                        .hero .absoluteBox {
                            position: absolute;
                            top: 0;
                            right: 0
                            left: 0;
                            padding: 160px 50px;
                            z-index: 2;
                        }
                        @media (max-width: 768px) {
                            .hero .absoluteBox {
                                padding: 120px 30px;
                            }
                        }
                        @media (max-width: 639px) {
                            .hero .absoluteBox {
                                padding: 100px 20px; /* чуть меньше отступов */
                                text-align: center; /* центр текста */
                            }
                            .hero .absoluteBox .mt-10 {
                                justify-content: center; /* центрируем кнопку */
                            }
                        }

                        .hero .absoluteBox .title {
                            max-width: 45rem;
                            font-weight: 800;
                            font-size: 2.25rem;
                        }
                        @media (min-width: 640px) {
                            .hero .absoluteBox .title {
                                font-size: 3rem;
                            }
                        }
                        @media (min-width: 1024px) {
                            .hero .absoluteBox .title {
                                font-size: 4em;
                            }
                        }

                        .hero .absoluteBox .description {
                            max-width: 700px;
                            font-weight: 400;
                            font-size: 1rem;
                        }
                        @media (min-width: 640px) {
                            .hero .absoluteBox .description {
                                font-size: 1.1em;
                            }
                        }
                        @media (min-width: 1024px) {
                            .hero .absoluteBox .description {
                                font-size: 1.25em;
                            }
                        }
                    `}</style>

                    <video autoPlay muted loop playsInline>
                        <source src="/demo/videos/banner.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <div className="overlay" />

                    <div className="brand">
                        <h2 className="logo text-white uppercase">ÜMIT</h2>
                    </div>

                    <div className="absoluteBox">
                        <h1 className="title text-white uppercase">Empowering Charitable Giving with Blockchain</h1>
                        <p className="mt-4 text-white description">Experience a revolutionary charity platform that leverages blockchain for transparent, secure, and impactful donations to causes that matter.</p>
                        <div className="mt-10 flex align-items-center gap-3">
                            <Link href="/create-campaign">
                                <Button className="text-lg">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div id="features container" className="py-4 px-4 lg:px-8 mx-0 lg:mx-8">
                    <div className="grid justify-content-center">
                        <div className="col-12 text-center md:mt-8 mt-4 mb-4">
                            <h2 className="text-900 font-normal mb-2 md:text-4xl text-2xl">Platform Statistics</h2>
                            <span className="text-600 md:text-2xl text-lg">Real-time insights into our charitable campaigns</span>
                        </div>

                        <div className="col-12 md:col-6 lg:col-3 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '150px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center bg-yellow-200 mb-3"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-wallet text-2xl text-yellow-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-lg">Total Charity Campaigns</h5>
                                    <span>{platformStats?.totalCampaigns}</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-6 lg:col-3 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '150px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(145,226,237,0.2),rgba(251, 199, 145,0.2)), linear-gradient(180deg, rgba(253,228,165,0.2), rgba(172,180,223,0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center bg-cyan-200 mb-3"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-credit-card text-2xl text-cyan-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-lg">Total Donations Made</h5>
                                    <span>{platformStats?.totalDonationsCount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-6 lg:col-3 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '150px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(145,226,237,0.2), rgba(172,180,223,0.2)), linear-gradient(180deg, rgba(172,180,223,0.2), rgba(246,158,188,0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center bg-indigo-200"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-chart-line text-2xl text-indigo-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-lg">Total Amount Raised</h5>
                                    <span>{formattedTotalAmount} ETH</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-6 lg:col-3 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                            <div
                                style={{
                                    height: '150px',
                                    padding: '2px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(90deg, rgba(187,199,205,0.2),rgba(251,199,145,0.2)), linear-gradient(180deg, rgba(253,228,165,0.2), rgba(145,210,204,0.2))'
                                }}
                            >
                                <div className="p-3 surface-card h-full" style={{ borderRadius: '8px' }}>
                                    <div
                                        className="flex align-items-center justify-content-center bg-bluegray-200 mb-3"
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <i className="pi pi-fw pi-clock text-2xl text-bluegray-700"></i>
                                    </div>
                                    <h5 className="mb-2 text-lg">Successful Campaigns</h5>
                                    <span>{platformStats?.campaignsReachedTarget}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="highlights" className="py-4 px-4 lg:px-8 my-3 mx-0 lg:mx-8">
                    <div className="text-center">
                        <h2 className="text-900 font-normal mb-2 md:text-4xl text-2xl">Global Impact Through Blockchain</h2>
                        <span className="text-600 md:text-2xl text-lg">Transforming charitable giving with secure, transparent technology.</span>
                    </div>

                    <div className="grid mt-8 pb-2 md:pb-3">
                        <div className="flex justify-content-center col-12 lg:col-6 p-0 flex-order-1 lg:flex-order-0 border-round-3xl">
                            <img src="/demo/images/landing/mockup11.png" className="w-11" alt="mobile mockup" />
                        </div>

                        <div className="col-12 lg:col-6 my-auto flex flex-column lg:align-items-end text-center lg:text-right">
                            <div
                                className="flex align-items-center justify-content-center bg-purple-200 align-self-center lg:align-self-end"
                                style={{
                                    width: '4.2rem',
                                    height: '4.2rem',
                                    borderRadius: '10px'
                                }}
                            >
                                <i className="pi pi-fw pi-send text-5xl text-purple-700"></i>
                            </div>
                            <h2 className="line-height-1 text-900 md:text-4xl text-2xl font-normal">Decentralized Trust</h2>
                            <span className="text-700 md:text-2xl text-lg line-height-3 ml-0 md:ml-2" style={{ maxWidth: '650px' }}>
                                Our blockchain-powered system ensures every transaction is secure and verifiable, building trust with every donation.
                            </span>
                        </div>
                    </div>

                    <div className="grid my-3 pt-2 md:pt-4">
                        <div className="col-12 lg:col-6 my-auto flex flex-column text-center lg:text-left lg:align-items-start">
                            <div
                                className="flex align-items-center justify-content-center bg-yellow-200 align-self-center lg:align-self-start"
                                style={{
                                    width: '4.2rem',
                                    height: '4.2rem',
                                    borderRadius: '10px'
                                }}
                            >
                                <i className="pi pi-fw pi-desktop text-5xl text-yellow-700"></i>
                            </div>
                            <h2 className="line-height-1 text-900 md:text-4xl text-2xl font-normal">Transparent Operations</h2>
                            <span className="text-700 md:text-2xl text-lg line-height-3 mr-0 md:mr-2" style={{ maxWidth: '650px' }}>
                                Enjoy complete visibility into donation flows and campaign progress with real-time blockchain tracking.
                            </span>
                        </div>

                        <div className="flex justify-content-end flex-order-1 sm:flex-order-2 col-12 lg:col-6 p-0 border-round-3xl">
                            <img src="/demo/images/landing/mockup10.png" className="w-11" alt="desktop mockup" />
                        </div>
                    </div>
                </div>

                <div id="faq" className="py-4 px-4 lg:px-8 mx-0 lg:mx-8">
                    <div className="text-center mb-4">
                        <h2 className="text-900 font-normal mb-2 md:text-4xl text-2xl">Frequently Asked Questions</h2>
                        <span className="text-600 md:text-2xl text-lg">Answers to common questions about our blockchain charity platform</span>
                    </div>
                    <Accordion multiple expandIcon="pi pi-plus" collapseIcon="pi pi-minus" className="w-full">
                        <AccordionTab header="How does blockchain enhance charity donations?" className="border-round-3xl md:text-lg">
                            <p className="text-700 line-height-3 m-0">Blockchain technology ensures every donation is recorded transparently and immutably, building trust with both donors and beneficiaries.</p>
                        </AccordionTab>

                        <AccordionTab header="Is my donation secure?" className="my-2 border-round-3xl md:text-lg">
                            <p className="text-700 line-height-3 m-0">Yes, our platform employs advanced blockchain protocols to safeguard your transaction, ensuring your donation is both secure and traceable.</p>
                        </AccordionTab>

                        <AccordionTab header="Can I track the impact of my donation?" className="border-round-3xl md:text-lg">
                            <p className="text-700 line-height-3 m-0">
                                Absolutely. Our system provides real-time tracking, allowing you to see how your contribution is making a difference. To monitor transactions, visit{' '}
                                <a href="https://sepolia.etherscan.io/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    sepolia.etherscan.io
                                </a>{' '}
                                and search by your wallet address.
                            </p>
                        </AccordionTab>

                        <AccordionTab header="How do I start contributing?" className="my-2 border-round-3xl md:text-lg">
                            <p className="text-700 line-height-3 m-0">Getting started is easy—simply sign up, choose a cause, and donate using our secure, blockchain-powered platform.</p>
                        </AccordionTab>
                    </Accordion>
                </div>

                <div id="video" className="video-section py-4 px-4 lg:px-8 mx-0 my-3">
                    <style jsx>{`
                        .video-section {
                            padding: 1rem;
                        }

                        /* Заголовок */
                        .video-section h3 {
                            font-size: 2rem;
                            line-height: 1.2;
                        }
                        @media (max-width: 640px) {
                            .video-section h3 {
                                font-size: 1.5rem;
                            }
                        }

                        /* Контейнер под видео с соотношением сторон 16:9 */
                        .video-wrapper {
                            position: relative;
                            width: 100%;
                            padding-top: 56.25%; /* 9/16 */
                            margin: 0 auto;
                        }
                        /* Указывает iframe занять весь контейнер */
                        .video-wrapper :global(iframe) {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                        }
                    `}</style>

                    <h3 className="text-center text-900 font-normal mb-3 md:text-4xl text-2xl">Watch Our Platform Demo</h3>

                    <div className="video-wrapper">
                        <YouTube videoId="wmEs3GsuhNE" opts={videoOptions} />
                    </div>
                </div>

                <div
                    className="relative overflow-hidden py-2 lg:py-8 px-4 lg:px-8 mx-0 lg:mx-8 mb-5"
                    style={{
                        background: 'linear-gradient(180deg, #1E27AF 0%, #1B59E1 100%)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        borderRadius: '1.5rem'
                    }}
                >
                    <div
                        style={{
                            pointerEvents: 'none',
                            position: 'absolute',
                            top: '-210%',
                            left: '50%',
                            transform: 'translate(-50%, 36rem) rotate(180deg)',
                            width: '50rem',
                            opacity: 0.4
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '9999px',
                                border: '1px solid rgba(255,255,255,0)',
                                width: '100%',
                                aspectRatio: '1 / 1',
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 32.21%)',
                                boxShadow: '0px -18px 58px 0px rgba(0,0,0,0.06)'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '9999px',
                                    border: '1px solid rgba(255,255,255,0)',
                                    width: '85%',
                                    aspectRatio: '1 / 1',
                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 32.21%)',
                                    boxShadow: '0px -18px 58px 0px rgba(0,0,0,0.06)'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '9999px',
                                        width: '80%',
                                        aspectRatio: '1 / 1',
                                        background: 'linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 32.21%)',
                                        boxShadow: '0px -18px 58px 0px rgba(0,0,0,0.06)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className="hidden lg:block"
                        style={{
                            position: 'absolute',
                            left: '18rem',
                            top: '4rem'
                        }}
                    >
                        <span
                            style={{
                                position: 'absolute',
                                width: '110%',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '9999px',
                                backdropFilter: 'blur(2px)',
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                zIndex: 10
                            }}
                        />
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: '9999px',
                                overflow: 'hidden',
                                width: '2.5rem',
                                height: '2.5rem',
                                backdropFilter: 'blur(16px)'
                            }}
                        >
                            <img
                                alt="Avatar Image"
                                src="https://primefaces.org/cdn/templates/genesis//avatars/male-1.jpg?w=3840&q=75"
                                style={{
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    left: 0,
                                    top: 0
                                }}
                            />
                        </div>
                    </div>

                    <div
                        className="hidden lg:block"
                        style={{
                            position: 'absolute',
                            top: '10rem',
                            left: '12rem',
                            borderRadius: '9999px',
                            overflow: 'hidden',
                            width: '4.5rem',
                            height: '4.5rem',
                            backdropFilter: 'blur(16px)'
                        }}
                    >
                        <img
                            alt="Avatar Image"
                            src="https://primefaces.org/cdn/templates/genesis//avatars/male-4.jpg?w=3840&q=75"
                            style={{
                                objectFit: 'cover',
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                left: 0,
                                top: 0
                            }}
                        />
                    </div>

                    <div
                        className="hidden lg:block"
                        style={{
                            position: 'absolute',
                            left: '22rem',
                            top: '18rem'
                        }}
                    >
                        <span
                            style={{
                                position: 'absolute',
                                width: '110%',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '9999px',
                                backdropFilter: 'blur(2px)',
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                zIndex: 10
                            }}
                        />
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: '9999px',
                                overflow: 'hidden',
                                width: '3rem',
                                height: '3rem',
                                backdropFilter: 'blur(16px)'
                            }}
                        >
                            <img
                                alt="Avatar Image"
                                src="https://primefaces.org/cdn/templates/genesis//avatars/female-4.jpg?w=3840&q=75"
                                style={{
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    left: 0,
                                    top: 0
                                }}
                            />
                        </div>
                    </div>

                    <div
                        className="hidden lg:block"
                        style={{
                            position: 'absolute',
                            left: 'calc(100% - 24rem)',
                            top: '18rem'
                        }}
                    >
                        <span
                            style={{
                                position: 'absolute',
                                width: '110%',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '9999px',
                                backdropFilter: 'blur(2px)',
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                zIndex: 10
                            }}
                        />
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: '9999px',
                                overflow: 'hidden',
                                width: '3.5rem',
                                height: '3.5rem',
                                backdropFilter: 'blur(16px)'
                            }}
                        >
                            <img
                                alt="Avatar Image"
                                src="https://primefaces.org/cdn/templates/genesis//avatars/female-6.jpg?w=3840&q=75"
                                style={{
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    left: 0,
                                    top: 0
                                }}
                            />
                        </div>
                    </div>

                    <div
                        className="hidden lg:block"
                        style={{
                            position: 'absolute',
                            top: '10rem',
                            left: 'calc(100% - 15rem)',
                            borderRadius: '9999px',
                            overflow: 'hidden',
                            width: '4.5rem',
                            height: '4.5rem',
                            backdropFilter: 'blur(16px)'
                        }}
                    >
                        <img
                            alt="Avatar Image"
                            src="https://primefaces.org/cdn/templates/genesis//avatars/female-7.jpg?w=3840&q=75"
                            style={{
                                objectFit: 'cover',
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                left: 0,
                                top: 0
                            }}
                        />
                    </div>

                    <div
                        className="hidden lg:block"
                        style={{
                            position: 'absolute',
                            left: 'calc(100% - 16rem)',
                            top: '5rem'
                        }}
                    >
                        <span
                            style={{
                                position: 'absolute',
                                width: '110%',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '9999px',
                                backdropFilter: 'blur(2px)',
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                zIndex: 10
                            }}
                        />
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: '9999px',
                                overflow: 'hidden',
                                width: '2.5rem',
                                height: '2.5rem',
                                backdropFilter: 'blur(16px)'
                            }}
                        >
                            <img
                                alt="Avatar Image"
                                src="https://primefaces.org/cdn/templates/genesis//avatars/male-5.jpg?w=3840&q=75"
                                style={{
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    left: 0,
                                    top: 0
                                }}
                            />
                        </div>
                    </div>

                    <h2
                        className="md:text-5xl text-3xl"
                        style={{
                            textAlign: 'center',
                            color: '#fff',
                            marginTop: '3rem'
                        }}
                    >
                        Join the Charity Revolution Today
                    </h2>

                    <p
                        style={{
                            textAlign: 'center',
                            color: '#fff',
                            maxWidth: '600px',
                            margin: '1rem auto'
                        }}
                    >
                        Make an impact with every donation on our secure, transparent, and decentralized platform. Your contribution can transform lives.
                    </p>

                    <div className='text-center md:my-5 my-4'>
                        <Link href="/display-campaigns">
                            <button
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '9999px',
                                    backgroundColor: '#fff',
                                    color: '#1B59E1',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Donate Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
