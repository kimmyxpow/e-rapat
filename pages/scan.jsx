import Html5QrcodePlugin from '@/components/Html5QrcodePlugin'
import Link from 'next/link'
import React from 'react'

const scan = () => {
	function onNewScanResult(decodedText, decodedResult) {
		console.log(decodedText, decodedResult)
	}

	return (
		<div className='min-h-screen flex items-center justify-center relative overflow-x-hidden py-14'>
			<div className="bg-[url('/img/patterns-dark.svg')] bg-cover absolute md:left-0 md:inset-y-0 md:w-1/2 md:h-auto top-0 inset-x-0 md:inset-x-auto h-1/2 z-0"></div>
			<div className='bg-white p-10 relative z-10 w-[400px] max-w-full shadow-2xl rounded-xl space-y-6'>
				<div className='flex items-center gap-2 justify-center'>
					<img src='/img/Logo.png' />
					<span className='font-bold text-2xl text-zinc-800'>
						E-Rapat
					</span>
				</div>
				<div className='text-center'>
					<h1 className='text-3xl font-bold text-zinc-800'>
						Silakan Scan QR
					</h1>
					<Link href='/'>
						<a className='text-zinc-600 inline-block hover:underline'>
							Kembali ke halaman login
						</a>
					</Link>
				</div>
				<Html5QrcodePlugin
					fps={10}
					qrbox={250}
					disableFlip={false}
					qrCodeSuccessCallback={onNewScanResult}
				/>
			</div>
			<div className='bg-zinc-800 absolute md:right-0 md:inset-y-0 md:w-1/2 md:h-auto bottom-0 inset-x-0 md:inset-x-auto h-1/2'>
				<div id='particles-js' className='h-full w-full'></div>
			</div>
		</div>
	)
}

export default scan
