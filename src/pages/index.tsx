import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/modules/Home.module.scss'
import Map from '@/components/Map'

const inter = Inter({ subsets: ['latin'] })


import { useEffect, useState } from 'react'

import { MdKeyboardArrowRight } from 'react-icons/md';

interface HomeProps {
	response: {
		status: string,
		country: string,
		countryCode: string,
		region: string,

	}
}

export default function Home({ response }: any) {

    const [enteredIP, setEnteredIP] = useState('');
    const [locationData, setLocationData] = useState(response);

    const [mapCenter, setMapCenter] = useState({
		lat: response.lat,
		lng: response.lon,
    });

    useEffect(() => {
      setMapCenter({ lat: locationData.lat, lng: locationData.lon });
    }, [locationData]);
  

	function formatOffsetToUTC(offset: number): string {
		const offsetHours = Math.floor(offset / 3600);
		const offsetMinutes = Math.floor((offset % 3600) / 60);
	  
		const sign = offsetHours >= 0 ? "+" : "-";
		const formattedHours = Math.abs(offsetHours).toString().padStart(2, '0');
		const formattedMinutes = Math.abs(offsetMinutes).toString().padStart(2, '0');
	  
		return `UTC ${sign}${formattedHours}:${formattedMinutes}`;
	}

  const handleFormSubmit = async (e: any) => {
		e.preventDefault();

		if (enteredIP) {
			try {
				const responseReq = await fetch(`http://ip-api.com/json/${enteredIP}?fields=status,message,country,city,lat,lon,timezone,offset,isp,query`);
				const newResponse = await responseReq.json();
				setLocationData(newResponse);
			} catch (error) {
				setLocationData('An error occurred');
			}
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
				<form onSubmit={handleFormSubmit} className={styles.form}>
					<input 
						type="text" 
						value={enteredIP}
						onChange={(e) => setEnteredIP(e.target.value)}
						className={styles.formInput}
						placeholder="Search for any IP address or domain"
					/>
					<button type="submit" className={styles.formBtn}>
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
				<Map mapCenter={mapCenter}/>
			</section>
		</main>
	</>
  )
}


export async function getServerSideProps({ req }: any) {
	let ip = "";
	
	if(process.env.NEXT_PUBLIC_FIXED_IP) {
		ip = process.env.NEXT_PUBLIC_FIXED_IP;
	}
	else {
		const forwarded = req.headers["x-forwarded-for"];
		ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
	}
	

	

	let response = "";

	try {
		const responseReq = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,city,lat,lon,timezone,offset,isp,query`);
		response = await responseReq.json();
	} catch (error) {
		response = 'An error occurred';
	}

	return {
		props: {
		response,
		},
	}
}
