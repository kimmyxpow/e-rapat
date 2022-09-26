import Aside from '@/components/Aside'
import Head from 'next/head'

const Layout = ({ title, children, pageTitle }) => {
	return (
		<>
			<Head>
				<title>{pageTitle}</title>
			</Head>
			<div className='flex min-h-screen h-screen max-h-screen overflow-hidden'>
				<Aside />
				<main className='h-full w-full bg-zinc-100 overflow-auto'>
					<div className="h-24 bg-[url('/img/patterns-lg.svg')]"></div>
					<div className='p-10'>
						<h1 className='text-2xl font-semibold text-zinc-800 mb-8'>
							{title}
						</h1>
						{children}
					</div>
				</main>
			</div>
		</>
	)
}

export default Layout
