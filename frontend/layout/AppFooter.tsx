import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Link from 'next/link';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="py-4 px-4 mx-0 mt-8 lg:mx-8">
            <div className="grid justify-content-between">
                <div className="col-12 md:col-2" style={{ marginTop: '-1.5rem' }}>
                    <Link href="/" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                        <img src={`/layout/images/logo3.png`} alt="footer sections" width="39" height="35" className="mr-2" />
                        <span className="font-medium text-3xl text-900">ÜMIT</span>
                    </Link>
                </div>

                <div className="col-12 md:col-10 lg:col-7">
                    <div className="grid text-center md:text-left">
                        <div className="col-12 md:col-3">
                            <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Company</h4>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                About Us
                            </Link>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                News
                            </Link>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                Investor Relations
                            </Link>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                Careers
                            </Link>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer text-700">
                                Media Kit
                            </Link>
                        </div>

                        <div className="col-12 md:col-3 mt-4 md:mt-0">
                            <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Actions</h4>
                            <Link href="/create-campaign" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                Create Campaign
                            </Link>
                            <Link href="/display-campaigns" className="line-height-3 text-xl block cursor-pointer text-700">
                                All Campaigns
                            </Link>
                        </div>

                        <div className="col-12 md:col-3 mt-4 md:mt-0">
                            <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Resources</h4>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                Get Started
                            </Link>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                Events
                                <img src="/demo/images/landing/new-badge.svg" className="ml-2" alt="badge" />
                            </Link>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                Discord
                            </Link>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                FAQ
                            </Link>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                Blog
                            </Link>
                        </div>

                        <div className="col-12 md:col-3 mt-4 md:mt-0">
                            <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Legal</h4>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                Brand Policy
                            </Link>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer mb-2 text-700">
                                Privacy Policy
                            </Link>
                            <Link href="/pages/notfound" className="line-height-3 text-xl block cursor-pointer text-700">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppFooter;
