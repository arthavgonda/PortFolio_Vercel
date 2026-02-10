import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Globe from "react-globe.gl";
import Button from "../components/Button.jsx";

const About = () => {

    const [hasCopied, setHasCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('anoopnegi311@gmail.com');
        setHasCopied(true);
        setTimeout(() => { setHasCopied(false); }, 2000);
    }
    return (
        <section id = "about">
            <div className="c-space my-20">
                <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">

                    <div className="col-span-1 xl:row-span-3">
                        <div className="grid-container">
                            <img
                                src="/assets/grid1.png"
                                alt="grid-1"
                                className="w-full sm:h-[276px] h-fit object-contain"
                            />
                            <div>
                                <p className="grid-headtext">Hi, I'm Anoop</p>
                                <p className="grid-subtext">
                                    A Computer Science undergraduate with hands-on experience in
                                    building full-stack and AI-driven systems. I have developed
                                    solutions spanning machine learning, backend APIs, and
                                    interactive web interfaces, with a strong focus on performance,
                                    scalability, and clean system design.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 xl:row-span-3">
                        <div className="grid-container">
                            <img
                                src="/assets/grid2.png"
                                alt="grid-2"
                                className="w-full sm:h-[276px] h-fit object-contain"
                            />
                            <div>
                                <p className="grid-headtext">Tech Stack</p>
                                <p className="grid-subtext">
                                    I specialise in building scalable software systems and
                                    data-driven applications, with experience across backend
                                    development, machine learning pipelines, and
                                    performance-focused system design.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 xl:row-span-4">
                        <div className="grid-container">
                            <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center">
                                <Globe
                                    height={326}
                                    width={326}
                                    backgroundColor="rgba(0,0,0,0)"
                                    backgroundImageOpacity={0.5}
                                    showAtmosphere
                                    showGraticules
                                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                                    labelsData={[{ lat: 28.70, lng: 77, text: "I'm here", color: 'white', size: 20 }]}
                                />
                            </div>
                            <div>
                                <p className="grid-headtext">
                                    I’m very flexible with time zone communications & locations
                                </p>
                                <p className="grid-subtext">
                                    Based in Dehradun, Uttrakhand, with availability for remote work across global time zones.
                                </p>
                                <Button name="Contact Me" isBeam containerClass="w-full mt-10"/>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-2 xl:row-span-3">
                        <div className="grid-container">
                            <img src="/assets/grid3.png" alt="grid-3" className="w-full sm:h-[276px] h-fit object-contain" />
                            <div>
                                <p className="grid-headtext">
                                    My passion for Coding
                                </p>
                                <p className="grid-subtext">
                                    I love solving problems and building things with code. Coding isn't just my profession, it is my passion
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 xl:row-span-2">
                        <div className="grid-container">
                            <img src="/assets/grid4.png" alt="grid-4" className="w-full sm:h-[126px] h-fit object-cover sm:object-top" />
                            <div className="space-y-2">
                                <p className="grid-subtext text-center">
                                    Contact me
                                </p>
                                <div className="copy-container" onClick={handleCopy}>
                                    <img src={hasCopied ? "/assets/tick.svg" : "/assets/copy.svg"} alt="copy" />
                                    <p className="lg:text-2xl md:text-xl font-medium text-gray_gradient text-white">anoopnegi311@gmail.com</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;