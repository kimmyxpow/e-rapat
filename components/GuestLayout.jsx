import React from 'react'

const GuestLayout = ({ children }) => {
	return (
		<div className='min-h-screen flex items-center justify-center relative overflow-x-hidden py-14'>
			<div className="bg-[url('/img/patterns-dark.svg')] bg-cover absolute md:left-0 md:inset-y-0 md:w-1/2 md:h-auto top-0 inset-x-0 md:inset-x-auto h-1/2 z-0"></div>
			{children}
			<div className='bg-zinc-800 absolute md:right-0 md:inset-y-0 md:w-1/2 md:h-auto bottom-0 inset-x-0 md:inset-x-auto h-1/2'>
				<div id='particles-js' className='h-full w-full'></div>
			</div>
		</div>
	)
}

export default GuestLayout
