import Head from 'next/head'
import React from 'react'
import ParticlesBackground from './ParticlesBackground'

const GuestLayout = ({ children, pageTitle, particle = false }) => {
	return (
		<>
			<Head>
				<title>{pageTitle}</title>
			</Head>
			<div className='min-h-screen flex items-center justify-center relative overflow-x-hidden py-14'>
				{particle ? (
					<ParticlesBackground status={particle} />
				) : (
					<>
						<div className="bg-[url('/img/patterns-dark.svg')] bg-cover absolute md:left-0 md:inset-y-0 md:w-1/2 md:h-auto top-0 inset-x-0 md:inset-x-auto h-1/2 z-0"></div>
						<div className='bg-zinc-800 absolute md:right-0 md:inset-y-0 md:w-1/2 md:h-auto bottom-0 inset-x-0 md:inset-x-auto h-1/2'>
							<div
								id='particles-js'
								className='h-full w-full'
							></div>
						</div>
					</>
				)}
				{children}
			</div>
		</>
	)
}

export default GuestLayout
