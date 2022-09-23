import { unauthPage } from '@/middlewares/authorization'
import {
	AtSymbolIcon,
	LockClosedIcon,
	StarIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import Router from 'next/router'
import nookies from 'nookies'
import Link from 'next/link'
import ParticlesBackground from '@/components/ParticlesBackground'

export async function getServerSideProps(ctx) {
	await unauthPage(ctx)

	return { props: {} }
}

export default function Home({}) {
	const [fields, setFields] = useState({ email: '', password: '' })
	const [status, setStatus] = useState(0)
	const _id_meeting = nookies.get()._id_meeting

	async function loginHandler(e) {
		e.preventDefault()

		setStatus(1)

		const loginReq = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(fields),
			},
		)

		const loginRes = await loginReq.json()

		if (loginRes.success == false) return setStatus(2)

		nookies.destroy(null, '_token')
		nookies.destroy(null, '_user')

		nookies.set(null, '_token', loginRes.token)
		nookies.set(null, '_user', JSON.stringify(loginRes.user))

		Router.push('/dashboard')
	}

	function fieldHandler(e) {
		const name = e.target.getAttribute('name')

		setFields({
			...fields,
			[name]: e.target.value,
		})
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
						Hello Again!
					</h1>
					<p className='text-zinc-600'>
						Welcome back! Please enter your detail.
					</p>
				</div>
				{status === 2 && (
					<span className='block py-3 px-8 rounded-lg bg-red-200 text-red-600 border border-red-400 text-center'>
						Login Failed
					</span>
				)}
				<form
					action='#'
					className='space-y-8'
					onSubmit={loginHandler.bind(this)}
				>
					<div className='space-y-6'>
						<div className='space-y-2'>
							<label
								className='font-bold text-zinc-800'
								htmlFor='email'
							>
								Email
							</label>
							<div className='flex items-center'>
								<div className='grid place-items-center bg-zinc-800 text-white min-h-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] max-w-[2.5rem] rounded-l-lg'>
									<AtSymbolIcon className='w-4' />
								</div>
								<input
									className='py-2 focus:outline-none w-full px-4 bg-zinc-200 rounded-r-lg text-zinc-600 ring ring-transparent focus:ring-indigo-600 transition-all duration-200'
									placeholder='example@domain.id'
									type='email'
									name='email'
									onInput={fieldHandler.bind(this)}
								/>
							</div>
						</div>
						<div className='space-y-2'>
							<label
								className='font-bold text-zinc-800'
								htmlFor='password'
							>
								Password
							</label>
							<div className='flex items-center'>
								<div className='grid place-items-center bg-zinc-800 text-white min-h-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] max-w-[2.5rem] rounded-l-lg'>
									<LockClosedIcon className='w-4' />
								</div>
								<input
									className='py-2 focus:outline-none w-full px-4 bg-zinc-200 rounded-r-lg text-zinc-600 ring ring-transparent focus:ring-indigo-600 transition-all duration-200'
									placeholder='********'
									type='password'
									name='password'
									onInput={fieldHandler.bind(this)}
								/>
							</div>
						</div>
					</div>
					<div className='flex flex-col items-center gap-4'>
						<button
							className={`py-2 w-full px-4 ${
								status != 1 ? 'bg-indigo-600' : 'bg-indigo-400'
							} rounded text-white font-semibold ring ring-transparent focus:ring-indigo-600 transition-all duration-200`}
							disabled={status != 1 ? false : true}
						>
							{status != 1 ? (
								'Login'
							) : (
								<StarIcon className='w-6 animate-spin mx-auto' />
							)}
						</button>
						<span className='text-sm text-zinc-400'>Or</span>
						<Link href={_id_meeting ? '/register' : 'scan'}>
							<a
								className={`py-2 w-full px-4 bg-indigo-200 text-indigo-600 rounded font-semibold ring ring-transparent focus:ring-indigo-600 transition-all duration-200 inline-block text-center`}
							>
								Scan Qr
							</a>
						</Link>
					</div>
				</form>
			</div>
			<ParticlesBackground />
		</div>
	)
}
