import Html5QrcodePlugin from '@/components/Html5QrcodePlugin'
import Link from 'next/link'
import React, { useState } from 'react'
import nookies from 'nookies'
import { useRouter } from 'next/router'
import { LinkIcon, StarIcon } from '@heroicons/react/24/outline'
import { unRegisterMeetingPage } from '@/middlewares/registerMeeting'
import ParticlesBackground from '@/components/ParticlesBackground'
import GuestLayout from '@/components/GuestLayout'

export async function getServerSideProps(ctx) {
	const { id } = ctx.query

	const req = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/participants/show/${id}`,
	)

	if (!req.ok) ctx.res.writeHead(302, { Location: `/` }).end()

	const { participant } = await req.json()

	if (participant.status < 2)
		ctx.res
			.writeHead(302, { Location: `/check_in/${participant._id}` })
			.end()

	return {
		props: { meeting: participant.meeting, participant },
	}
}
const CheckIn = ({ meeting, participant }) => {
	return (
		<GuestLayout
			pageTitle={`Sukses Mengikuti Rapat ${meeting.event} - ${participant.name} | E-Rapat`}
			particle='success'
		>
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
				<div className='text-center space-y-4'>
					<span className='block py-3 px-8 rounded-lg bg-green-200 text-green-600 border border-green-400 text-center'>
						Berhasil mengikuti rapat!
					</span>
					<p className='text-zinc-600'>
						Kamu berhasil register dan melakukan semua absensi pada
						rapat kali ini!
					</p>
				</div>
				<Link href='/'>
					<a
						className={`py-2 w-full px-4 bg-indigo-600 block text-center rounded text-white font-semibold ring ring-transparent focus:ring-indigo-600 transition-all duration-200`}
					>
						Kembali ke halaman utama
					</a>
				</Link>
			</div>
		</GuestLayout>
	)
}

export default CheckIn
