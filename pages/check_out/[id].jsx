import Html5QrcodePlugin from '@/components/Html5QrcodePlugin'
import Link from 'next/link'
import React, { useState } from 'react'
import nookies from 'nookies'
import { useRouter } from 'next/router'
import { LinkIcon, StarIcon } from '@heroicons/react/24/outline'
import { unRegisterMeetingPage } from '@/middlewares/registerMeeting'

export async function getServerSideProps(ctx) {
	const { id } = ctx.query

	const req = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/participants/show/${id}`,
	)

	if (!req.ok) ctx.res.writeHead(302, { Location: `/` }).end()

	const { participant } = await req.json()

	if (participant.status == 2)
		ctx.res
			.writeHead(302, { Location: `/success/${participant._id}` })
			.end()

	return {
		props: { id },
	}
}
const CheckOut = ({ id }) => {
	const router = useRouter()
	const [status, setStatus] = useState(0)
	const url = process.env.NEXT_PUBLIC_APP_URL + router.asPath

	async function loadParticipant(id) {
		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/participants/show/${id}`,
		)

		const res = await req.json()

		return res.participant
	}

	async function onNewScanResult(decodedText) {
		setStatus(1)

		const participant = await loadParticipant(id)

		if (decodedText != participant.meeting) return setStatus(2)

		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/participants/${id}/out`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)

		router.push(`/success/${id}`)
	}

	return (
		<div className='min-h-screen flex items-center justify-center relative overflow-x-hidden py-14'>
			<div className="bg-[url('/img/patterns-dark.svg')] bg-cover absolute md:left-0 md:inset-y-0 md:w-1/2 md:h-auto top-0 inset-x-0 md:inset-x-auto h-1/2 z-0"></div>
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
						Check Out Scan
					</h1>
					<p className='text-zinc-600'>
						Simpan link absensi dibawah ini agar tidak hilang
					</p>
				</div>
				<div className='flex items-center'>
					<div className='grid place-items-center bg-zinc-800 text-white min-h-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] max-w-[2.5rem] rounded-l-lg'>
						<LinkIcon className='w-4' />
					</div>
					<input
						className='py-2 focus:outline-none w-full px-4 bg-zinc-200 rounded-r-lg text-zinc-600 ring ring-transparent focus:ring-indigo-600 transition-all duration-200'
						value={url}
						readOnly
						type='text'
					/>
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
			</div>
			<div className='bg-zinc-800 absolute md:right-0 md:inset-y-0 md:w-1/2 md:h-auto bottom-0 inset-x-0 md:inset-x-auto h-1/2'>
				<div id='particles-js' className='h-full w-full'></div>
			</div>
		</div>
	)
}

export default CheckOut
