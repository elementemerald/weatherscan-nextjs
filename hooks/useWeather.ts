import * as React from "react";
import { Icons2010 } from "./useIconMap";

// Mapped location
export interface Location {
    city: string
    state: string
    country: string
    countryCode: string
    latitude: number
    longitude: number
    timezone: string
}

// api.weather.com
interface WeatherAPILocation {
    city: string[]
    adminDistrict: string[]
    country: string[]
    countryCode: string[]
    latitude: number[]
    longitude: number[]
    ianaTimeZone: string[]
}

interface WeatherAPIExtraLoc {
    city: string
    adminDistrict: string
    country: string
    countryCode: string
    latitude: number
    longitude: number
    ianaTimeZone: string
}

interface WeatherAPILocResponse {
    location: Partial<WeatherAPILocation>
}

interface WeatherAPIExtraLocResponse {
    location: Partial<WeatherAPIExtraLoc>
}

// ip-api.com
enum IPAPIStatus {
    SUCCESS = "success",
    FAIL = "fail"
}

interface IPAPILocResponse {
    status: IPAPIStatus
    city: string
    region: string
    regionName: string
    country: string
    countryCode: string
    lat: number
    lon: number
    timezone: string
}

export const defaults: Location = Object.freeze({
    status: "",
    city: "",
    state: "",
    country: "",
    countryCode: "",
    latitude: null,
    longitude: null,
    timezone: ""
});

export interface CurrentCond {
    temp: number
    icon: number
    wind: string
    windSpeed: number
    visib: number
    uvIndex: string
    phrase: string
    humidity: number
    dewpt: number
    pres: number
    chill: number
}

export const currentDefaults: CurrentCond = Object.freeze({
    temp: NaN,
    icon: 44,
    wind: "",
    windSpeed: 0,
    visib: 0,
    uvIndex: "",
    phrase: "",
    humidity: 0,
    dewpt: 0,
    pres: 0,
    chill: NaN
});

const memoAsync = (cb) => {
    const cache = new Map();
    return async (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const value = await cb(...args);
        cache.set(key, value);
        return value;
    };
};

const memoizedFetch = memoAsync(fetch);

export const getMainLocation = async (location: string, language?: string) => {
    const apiLanguage = language || "en-US";

    return memoizedFetch(`https://api.weather.com/v3/location/search?query=${encodeURIComponent(location)}&language=${apiLanguage}&format=json&apiKey=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`)
        .then(async (res: Response) => {
            return res.json().then((data: WeatherAPILocResponse) => {
                const dataLocs = data.location;

                const loc = Object.assign({}, defaults);
                loc.city = dataLocs.city[0];
                loc.state = dataLocs.adminDistrict[0];
                loc.country = dataLocs.country[0];
                loc.countryCode = dataLocs.countryCode[0];
                loc.latitude = dataLocs.latitude[0];
                loc.longitude = dataLocs.longitude[0];
                loc.timezone = dataLocs.ianaTimeZone[0];

                return loc;
            }).catch(err => {
                throw new Error(err);
            });
        }).catch(err => {
            throw new Error(err);
        });
};

export const getClosestLocation = async () => {
    return memoizedFetch(`https://pro.ip-api.com/json/?key=${process.env.NEXT_PUBLIC_IP_API_KEY}&exposeDate=true`)
        .then(async (res: Response) => {
            return res.json().then((data: IPAPILocResponse) => {
                if (data.status === IPAPIStatus.SUCCESS) {
                    const closest = Object.assign({}, defaults);
                    closest.city = data.city;
                    closest.state = data.region;
                    closest.country = data.country;
                    closest.countryCode = data.countryCode;
                    closest.latitude = data.lat;
                    closest.longitude = data.lon;
                    closest.timezone = data.timezone;

                    return closest;
                }

                return defaults;
            }).catch(err => {
                throw new Error(err);
            });
        }).catch(err => {
            throw new Error(err);
        });
};

export const getExtraLocations = async (lat: number, lon: number) => {
    return memoizedFetch(`https://api.weather.com/v3/location/near?geocode=${lat},${lon}&product=observation&format=json&apiKey=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`)
        .then(async (res: Response) => {
            return res.json().then((data: WeatherAPIExtraLocResponse) => {
                const dataLoc = data.location;
            });
        });
};

export const getCurrentCond = async (lat: number, lon: number, language?: string) => {
    const apiLanguage = language || "en-US";
    return memoizedFetch(`https://api.weather.com/v3/aggcommon/v3-wx-observations-current?geocodes=${lat},${lon};&language=${apiLanguage}&units=s&format=json&apiKey=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`)
        .then(async (res: Response) => {
            return res.json().then(data => {
                const dataLoc = data[0]["v3-wx-observations-current"];

                const current = Object.assign({}, currentDefaults);
                current.temp = dataLoc.temperature;
                current.icon = dataLoc.iconCode;
                current.wind = `${(dataLoc.windDirectionCardinal === "CALM" || dataLoc.windSpeed === 0 ? "Calm" : dataLoc.windDirectionCardinal)} ${dataLoc.windSpeed === 0 ? "" : dataLoc.windSpeed}`;
                current.windSpeed = dataLoc.windSpeed;
                current.visib = dataLoc.visibility;
                current.uvIndex = dataLoc.uvDescription;
                current.phrase = dataLoc.wxPhraseLong.toLowerCase();
                current.humidity = dataLoc.relativeHumidity;
                current.dewpt = dataLoc.temperatureDewPoint;
                current.pres = dataLoc.pressureAltimeter.toFixed(2);
                current.chill = dataLoc.temperatureWindChill;

                return current;
            }).catch(err => {
                throw new Error(err);
            });
        }).catch(err => {
            throw new Error(err);
        });
};

enum MessageType {
    New = 1,
    Update,
    Cancel
}

enum AreaType {
    County = "C",
    Zone = "Z",
    CanadaLocation = "CLC"
}

enum Certainty {
    Observed = 1,
    Likely,
    Possible,
    Unlikely,
    Unknown
}

enum Severity {
    Extreme = 1,
    Severe,
    Moderate,
    Minor,
    Unknown
}

enum Urgency {
    Immediate = 1,
    Expected,
    Future,
    Past,
    Unknown
}

// Category object
enum CategoryCode {
    Geo = 1,
    Met,
    Safety,
    Security,
    Rescue,
    Fire,
    Health,
    Env,
    Transport,
    Infra,
    CBRNE,
    Other
}

interface Category {
    category: string
    categoryCode: CategoryCode
}

// Flood object
interface Flood {
    floodCrestTimeLocal: string
    floodCrestTimeLocalTimeZone: string
    floodEndTimeLocal: string
    floodEndTimeLocalTimeZone: string
    floodImmediateCause: string
    floodImmediateCauseCode: string
    floodLocationId: string
    floodLocationName: string
    floodRecordStatus: string
    floodRecordStatusCode: string
    floodSeverity: string
    floodSeverityCode: string
    floodStartTimeLocal: string
    floodStartTimeLocalTimeZone: string
}

// Response type object
enum ResponseTypeCode {
    Shelter = 1,
    Evacuate,
    Prepare,
    Execute,
    Avoid,
    Monitor,
    Assess,
    AllClear,
    None
}

interface ResponseType {
    responseType: string
    responseTypeCode: ResponseTypeCode
}

interface Text {
    languageCode: string
    description: string
    instruction: string
    overview: string
}

export interface Alert {
    adminDistrict: string
    adminDistrictCode: string
    areaId: string
    areaName: string
    areaTypeCode: AreaType
    certainty: string
    certaintyCode: Certainty
    countryCode: string
    countryName: string
    detailKey: string
    disclaimer: string
    effectiveTimeLocal: string
    effectiveTimeLocalTimeZone: string
    eventDescription: string
    eventTrackingNumber: string
    expireTimeLocal: string
    expireTimeLocalTimeZone: string
    expireTimeUTC: number
    headlineText: string
    ianaTimeZone: string
    identifier: string
    issueTimeLocal: string
    issueTimeLocalTimeZone: string
    latitude: number
    longitude: number
    messageType: string
    messageTypeCode: MessageType
    officeAdminDistrict: string
    officeAdminDistrictCode: string
    officeCode: string
    officeCountryCode: string
    officeName: string
    onsetTimeLocal: string
    onsetTimeLocalTimeZone: string
    phenomena: string
    processTimeUTC: number
    productIdentifier: string
    severity: string
    severityCode: Severity
    significance: string
    source: string
    urgency: string
    urgencyCode: Urgency
    endTimeLocal: string
    endTimeLocalTimeZone: string
    endTimeUTC: number
    categories: Category[]
    flood: Flood
    responseTypes: ResponseType[]
    texts: Text[]
}

interface AlertsMetadata {
    next: any
}

interface AlertsResponse {
    metadata?: AlertsMetadata
    alerts: Alert[]
}

const alertsFallback: AlertsResponse = Object.freeze({
    metadata: {
        next: null
    },
    alerts: []
});

export const getAlerts = async (lat: number, lon: number, language?: string) => {
    const apiLanguage = language || "en-US";
    return memoizedFetch(`https://api.weather.com/v3/alerts/headlines?geocode=${lat},${lon}&language=${apiLanguage}&format=json&apiKey=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`)
        .then(async (res: Response) => {
            return res.json().then((data: AlertsResponse) => {
                return data.alerts;
            }).catch(() => {
                return alertsFallback.alerts;
            });
        }).catch(err => {
            throw new Error(err);
        });
};

interface AlertDetailResponse {
    alertDetail: Alert
}

export const getAlertText = async (alertId: string, language?: string) : Promise<Text[]> => {
    const apiLanguage = language || "en-US";
    return memoizedFetch(`https://api.weather.com/v3/alerts/detail?alertId=${alertId}&language=${apiLanguage}&format=json&apiKey=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`)
        .then(async (res: Response) => {
            return res.json().then((data: AlertDetailResponse) => {
                return data.alertDetail.texts;
            }).catch(() => {
                return null;
            });
        }).catch(err => {
            throw new Error(err);
        })
};