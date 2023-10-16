import { GeolocationResponse } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";


type ErrorResponse = {
    error: string
}

/**
 * Geolocation fetch
 * API route from the server to do http requests
 * 
 * @param req 
 * @param res 
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GeolocationResponse | ErrorResponse>
) {
    try {
        const response = await fetch(`http://ip-api.com/json/${req.query.ip}?fields=status,message,country,city,lat,lon,timezone,offset,isp,query`);

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            res.status(500).json({ error: 'Failed to fetch geolocation data.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching geolocation data.' });
    }
};