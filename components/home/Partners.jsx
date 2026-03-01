import React from 'react';

const Partners = ({ company }) => {
    if (!company?.partners || company.partners.length === 0) return null;

    // Create a large enough array so it overflows the screen for the continuous scroll
    // If the user only has a few partners, we need to duplicate them multiple times.
    const dupes = company.partners.length < 5 ? 8 : 4;
    const duplicatedPartners = Array(dupes).fill(company.partners).flat();

    return (
        <section className="py-12   overflow-hidden ">
            <div className="container mx-auto px-4 mb-8 text-center">
                <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                    Trusted by Innovative Brands
                </h3>
            </div>

            <div className="relative flex overflow-hidden group w-full   py-4">

                <div className="flex w-max animate-marquee hover:pause">
                    {/* First set */}
                    <div className="flex w-1/2 justify-around">
                        {duplicatedPartners.map((partner, i) => (
                            <div key={`p1-${i}`} className="flex-none mx-4 md:mx-12 flex flex-col items-center justify-center gap-2 md:gap-3 w-auto min-w-[100px] md:min-w-[150px]">
                                {partner.logo && (
                                    <img src={partner.logo} alt={partner.name} className="h-8 md:h-12 w-auto object-contain shrink-0" />
                                )}
                                {partner.name && (
                                    <span className="text-base md:text-xl font-bold text-foreground/80 whitespace-nowrap text-center">{partner.name}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Second set for seamless loop */}
                    <div className="flex w-1/2 justify-around">
                        {duplicatedPartners.map((partner, i) => (
                            <div key={`p2-${i}`} className="flex-none mx-4 md:mx-12 flex flex-col items-center justify-center gap-2 md:gap-3 w-auto min-w-[100px] md:min-w-[150px]">
                                {partner.logo && (
                                    <img src={partner.logo} alt={partner.name} className="h-8 md:h-12 w-auto object-contain shrink-0" />
                                )}
                                {partner.name && (
                                    <span className="text-base md:text-xl font-bold text-foreground/80 whitespace-nowrap text-center">{partner.name}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
                @media (max-width: 768px) {
                    .animate-marquee {
                        animation: marquee 50s linear infinite;
                    }
                }
                .hover\\:pause:hover {
                    animation-play-state: paused;
                }
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
            `}} />
        </section>
    );
};

export default Partners;
