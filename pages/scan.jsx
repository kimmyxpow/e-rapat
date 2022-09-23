import Html5QrcodePlugin from '@/components/Html5QrcodePlugin'
import Link from 'next/link'
import React, { useState } from 'react'
import nookies from 'nookies'
import { useRouter } from 'next/router'
import { StarIcon } from '@heroicons/react/24/outline'
import { unRegisterMeetingPage } from '@/middlewares/registerMeeting'
import ParticlesBackground from '@/components/ParticlesBackground'

export async function getServerSideProps(ctx) {
	await unRegisterMeetingPage(ctx)

	return {
		props: {},
	}
}
const Scan = () => {
	const router = useRouter()
	const [status, setStatus] = useState(0)

	async function onNewScanResult(decodedText) {
		setStatus(1)

		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/meetings/show/${decodedText}`,
		)

		const res = await req.json()

		if (res.meeting == null) return setStatus(2)

		const { _id_meeting } = nookies.get()
		if (_id_meeting) nookies.destroy(null, '_id_meeting')
		nookies.set(null, '_id_meeting', decodedText)

		router.push('/register')
	}

	return (
		<div className='min-h-screen flex items-center justify-center relative overflow-x-hidden py-14'>
			<div className='bg-white p-10 relative z-10 w-[400px] max-w-full shadow-2xl rounded-xl space-y-6'>
				<div className='flex items-center gap-2 justify-center'>
					<picture>
						<source srcSet='/img/Logo.png' type='image/png' />
						<img src='/img/Logo.png' alt='Logo' />
					</picture>
					<span className='font-bold text-2xl text-zinc-800'>
						E-Rapat
					</span>
				</div>
				<div className='text-center'>
					<h1 className='text-3xl font-bold text-zinc-800'>
						Silakan Scan QR
					</h1>
				</div>
				{status == 2 && (
					<span className='block py-3 px-8 rounded-lg bg-red-200 text-red-600 border border-red-400 text-center'>
						Invalid rapat
					</span>
				)}
				{status == 1 ? (
					<span className='block py-3 px-8 rounded-lg bg-green-200 text-green-600 border border-green-400 text-center'>
						Tunggu sebentar
						<StarIcon className='w-6 animate-spin mx-auto inline-block' />
					</span>
				) : (
					<Html5QrcodePlugin
						fps={10}
						qrbox={250}
						disableFlip={false}
						qrCodeSuccessCallback={onNewScanResult}
					/>
				)}
				<Link Link href='/'>
					<a
						className={`py-2 w-full px-4 bg-red-600 rounded text-white font-semibold ring ring-transparent focus:ring-red-600 transition-all duration-200 block text-center`}
					>
						Kembali ke halaman login
					</a>
				</Link>
			</div>
			<ParticlesBackground />
		</div>
	)
}

export default Scan
