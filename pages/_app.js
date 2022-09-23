import { AppContext } from '@/contexts/app-context'
import Router from 'next/router'
import { useState } from 'react'
import '../styles/globals.css'
import NProgress from 'nprogress' //nprogress module
import 'nprogress/nprogress.css' //styles of nprogress

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }) {
	const [user, setUser] = useState({})

	return (
		<AppContext.Provider value={{ user, setUser }}>
			<Component {...pageProps} />
		</AppContext.Provider>
	)
}

export default MyApp
