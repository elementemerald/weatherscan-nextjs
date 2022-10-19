import * as React from "react";
import Forecast from "./Forecast";

const SlideCityInfo = () => (
    <>
        <div id="city-info-slide" className="relative bg-city-info-slide bg-no-repeat w-full min-h-infoslide max-h-infoslide overflow-hidden flex flex-col hidden">
            <div
                id="info-subheader"
                className="pr-subhead-city-info-r font-frutiger57-cond flex flex-row flex-nowrap justify-between text-subhead h-subhead z-subheader text-shadow-subhead leading-subheader relative text-white w-full p-slidehead"
            >
                <span id="subhead-titlei" className="absolute top-1/2 transform -translate-y-42-5" />
                <span
                    id="subhead-city"
                    className="font-frutiger text-subhead-city pt-0 transform -translate-y-43-5 scale-x-105-9 scale-y-100 origin-right right-subhead-city-r font-stretch-semi-exp"
                />
            </div>
            <div
                id="info-subheadershadowfix"
                className="font-normal font-frutiger57-cond text-white flex flex-row flex-nowrap justify-between text-subhead h-subhead z-subheader-shadow whitespace-nowrap text-shadow-subhead absolute min-w-subhead-shadow"
            />
            <div
                id="noreport"
                className="transform translate-x-0 translate-y-60px scale-x-114-5 scale-y-100 origin-left absolute whitespace-nowrap font-frutiger57-cond pt-noreport-t pl-noreport-l text-white text-noreport text-shadow z-noreport hidden"
            >No Report</div>
            <div
                id="tempunavailable"
                className="transform translate-x-0 translate-y-60px scale-x-114-5 scale-y-100 origin-left absolute whitespace-nowrap font-frutiger57-cond pt-noreport-t pl-tempunavailable-l text-white text-tempunavailable text-shadow z-noreport hidden"
            >Temporarily Unavailable</div>
            <Forecast />
        </div>
    </>
);

export default SlideCityInfo;
