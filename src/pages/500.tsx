import Head from "next/head";

import styles from '@/styles/modules/ServerError500.module.scss'

export default function ServerError500() {

  	return (
		<>
			<Head>
				<title>IP Address Tracker - Error</title>
				<meta name="description" content="IP Address tracker" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/images/favicon-32x32.png" />
			</Head>

			<main className={styles.main}>
				<h1>500 - Server error</h1>
                <p className={styles.text}>There has been a problem fetching your IP information.</p>
                <p className={styles.text}>If you are running the application locally, add a NEXT_PUBLIC_FIXED_IP key to your .env.local.<br/>Check the deployment section in the documentation for more information.</p>
			</main>
		</>
  	)
}