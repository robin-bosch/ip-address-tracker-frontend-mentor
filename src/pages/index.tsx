import Head from 'next/head'
import dynamic from 'next/dynamic';

import styles from '@/styles/modules/Home.module.scss'

import { useMemo, useState } from 'react'

import { MdKeyboardArrowRight } from 'react-icons/md';
import { GeolocationResponse, MapCenter } from '@/types';

interface HomeProps {
	response: GeolocationResponse
}

export default function Home({ response }: HomeProps) {
	
    const [enteredIP, setEnteredIP] = useState<string>('');
    const [locationData, setLocationData] = useState<GeolocationResponse>(response);

    const [mapCenter, setMapCenter] = useState<MapCenter>([response.lat, response.lon]);

	// Dynamic load of the map component, to render the map client side
	// Cache in useMemo to prevent flickering caused by re-rendering
	const Map = useMemo(() => dynamic(
		()  => import('@/components/Map'),
		{ ssr: false }
	), [mapCenter]);
	
	// Input error state
	const [showError, setShowError] = useState<boolean>(false);
  
	/**
	 * Format the incoming UTC offset in seconds to the displayable format
	 * @param offset - number
	 * @returns displayable string
	 */
	const formatOffsetToUTC = (offset: number): string => {
		const offsetHours = Math.floor(offset / 3600);
		const offsetMinutes = Math.floor((offset % 3600) / 60);
	  
		const sign = offsetHours >= 0 ? "+" : "-";
		const formattedHours = Math.abs(offsetHours).toString().padStart(2, '0');
		const formattedMinutes = Math.abs(offsetMinutes).toString().padStart(2, '0');
	  
		return `UTC ${sign}${formattedHours}:${formattedMinutes}`;
	}

	/**
	 * Get new geolocation data
	 * @param event 
	 */
	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		
		// Regex patterns provided by ChatGPT
		const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
		const ipv4Pattern = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;


		if (ipv6Pattern.test(enteredIP) || ipv4Pattern.test(enteredIP)) {
			try {
				const responseReq = await fetch(`/api/geolocation?ip=${enteredIP}`);
				const locationResponse = await responseReq.json();

				if(locationResponse.status === "success") {
					setLocationData(locationResponse);
					setMapCenter([locationResponse.lat, locationResponse.lon]);
					setShowError(false);
				}
				else {
					setShowError(true);
				}
			} catch (error) {
				setShowError(true);
			}
		}
		else {
			setShowError(true);
		}
	};

  	return (
		<>
			<Head>
				<title>IP Address Tracker</title>
				<meta name="description" content="IP Address tracker" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/images/favicon-32x32.png" />
			</Head>

			<main className={styles.main}>
				<section className={styles.ipSection}>
					<h1 className={styles.heading}>IP Address Tracker</h1>
					<form onSubmit={handleFormSubmit} className={showError ? `${styles.form} ${styles.formError}` : `${styles.form}`}>
						<input 
							type="text" 
							value={enteredIP}
							onChange={(e) => setEnteredIP(e.target.value)}
							className={styles.formInput}
							placeholder="Search for any IP address or domain"
							aria-label="IP address input"
						/>
						<button type="submit" aria-label="submit button" className={styles.formBtn}>
							<MdKeyboardArrowRight className={styles.formBtnIcon}/>
						</button>
					</form>
					<article className={styles.locationContainer}>
						<div className={styles.locationRow}>
							<p className={styles.locationDescription}>IP ADDRESS</p>
							<p className={styles.locationDataContent}>{locationData.query}</p>
						</div>
						<div className={styles.locationRow}>
							<p className={styles.locationDescription}>LOCATION</p>
							<p className={styles.locationDataContent}>{locationData.city}, {locationData.country}</p>
						</div>
						<div className={styles.locationRow}>
							<p className={styles.locationDescription}>TIMEZONE</p>
							<p className={styles.locationDataContent}>{locationData.timezone}<br/>{formatOffsetToUTC(locationData.offset)}</p>
						</div>
						<div className={styles.locationRow}>
							<p className={styles.locationDescription}>ISP</p>
							<p className={styles.locationDataContent}>{locationData.isp}</p>
						</div>
					</article>
				</section>
				<section className={styles.mapSection}>
					{/* Reference to dynamic in port in index page component directly */}
					<Map mapCenter={mapCenter}/>
				</section>
			</main>
		</>
  	)
}


export async function getServerSideProps({ req }: any) {
	// Check if there is a fixed IP for testing otherwise extract IP from request
	// Running locally without fixed IP can result in the local IP being passed to the api which will return nothing
	// Set a NEXT_PUBLIC_FIXED_IP variable in the .env.local to set the IP
	let ip = "";

	if(process.env.NEXT_PUBLIC_FIXED_IP) {
		ip = process.env.NEXT_PUBLIC_FIXED_IP;
	}
	else {
		const forwarded = req.headers["x-forwarded-for"];
		ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
	}

	// Get gelocation data
	let response: GeolocationResponse;

	try {
		const responseReq = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,city,lat,lon,timezone,offset,isp,query`);
		response = await responseReq.json();

		if(response.status !== "success") {
			return {
				redirect: {
				  permanent: false,
				  destination: "/500"
				}
			}
		}
	} catch (error) {
		return {
			redirect: {
			  permanent: false,
			  destination: "/500"
			}
		}
	}

	return {
		props: {
			response,
		},
	}
}
