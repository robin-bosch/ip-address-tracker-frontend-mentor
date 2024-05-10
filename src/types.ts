export type MapCenter = [number, number]

export type GeolocationResponse = {
    status: string,
    messgae: string,
    country: string,
    city: string,
    lat: number,
    lon: number,
    timezone: string,
    offset: number,
    isp: string,
    query: string
}