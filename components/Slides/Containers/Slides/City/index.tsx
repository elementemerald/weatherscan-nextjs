import * as React from "react";
import type { MainSlideProps } from "../../../../../hooks/useSlides";
import { SlideshowReducer, SlidesCity, ActionType, SlideProps } from "../../../../../hooks/useSlides";

import CityIntro from "./CityIntro";
import CityInfo from "./CityInfo";

const City = ({ next, location, currentCityInfo, isLoaded = false, setLoaded, setVocal }: MainSlideProps) => {
    const [slideState, slideDispatch] = React.useReducer(SlideshowReducer, { index: 0 });

    React.useEffect(() => {
        if (!isLoaded) setLoaded(true);
    }, []);

    const SlideCallback = React.useCallback(() => {
        if (slideState.index >= 1) {
            next();
            slideDispatch({ type: ActionType.SET, payload: 2 });
            setTimeout(() => slideDispatch({ type: ActionType.SET, payload: isLoaded ? 1 : 0 }), 900);
        } else {
            slideDispatch({ type: ActionType.INCREASE, payload: 1 });
        }
    }, [slideState.index, isLoaded]);

    const currentSlide = React.useMemo(() => {
        console.log("Rendering new city slide");
        switch (slideState.index) {
            case SlidesCity.INTRO:
                return <CityIntro next={SlideCallback} />;
            case SlidesCity.INFO:
                return <CityInfo
                    next={SlideCallback}
                    location={location}
                    currentCityInfo={currentCityInfo}
                    setVocal={setVocal}
                />;
        }
    }, [slideState.index, SlideCallback, location, currentCityInfo]);

    return currentSlide;
};

export default City;
