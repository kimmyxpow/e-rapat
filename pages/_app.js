import { AppContext } from '@/contexts/app-context'
import { useState } from 'react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
	const [user, setUser] = useState({})

	return (
		<AppContext.Provider value={{ user, setUser }}>
			<Component {...pageProps} />
		</AppContext.Provider>
	)
}

export default MyApp
