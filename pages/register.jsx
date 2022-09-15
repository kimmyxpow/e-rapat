import { registerMeetingPage } from '@/middlewares/registerMeeting'
import { AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export async function getServerSideProps(ctx) {
	await registerMeetingPage(ctx)
	const _id_meeting = JSON.parse(nookies.get(ctx)._id_meeting)

	const meeting = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/meetings/show/${_id_meeting}`,
		{
			headers: {
				Authorization: 'Bearer ' + token,
			},
		},
	)

	const s_meeting = await meeting.json()

	const user = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/users/show/${s_meeting.user.id}`,
		{
			headers: {
				Authorization: 'Bearer ' + token,
			},
		},
	)

	const s_user = await user.json()

	const category = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/categories/${s_user.id}`,
		{
			headers: {
				Authorization: 'Bearer ' + token,
			},
		},
	)

	const s_category = await category.json()

	return { props: {} }
}

const register = () => {
	const [fields, setFields] = useState({ email: '', password: '' })
	const [status, setStatus] = useState(0)

	function registerHandler() {
		//
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
						Silakan Isi Data Diri
					</h1>
					{/* <p className='text-zinc-600'>

					</p> */}
				</div>
				<form
					action='#'
					className='space-y-8'
					onSubmit={registerHandler.bind(this)}
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
								'Register'
							) : (
								<StarIcon className='w-6 animate-spin mx-auto' />
							)}
						</button>
						<span className='text-sm text-zinc-400'>Or</span>
						<button
							className={`py-2 w-full px-4 bg-red-200 text-red-600 rounded font-semibold ring ring-transparent focus:ring-red-600 transition-all duration-200 inline-block text-center`}
						>
							Batal
						</button>
					</div>
				</form>
			</div>
			<div className='bg-zinc-800 absolute md:right-0 md:inset-y-0 md:w-1/2 md:h-auto bottom-0 inset-x-0 md:inset-x-auto h-1/2'>
				<div id='particles-js' className='h-full w-full'></div>
			</div>
		</div>
	)
}

export default register
