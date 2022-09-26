import { registerMeetingPage } from '@/middlewares/registerMeeting'
import {
	AtSymbolIcon,
	BuildingOfficeIcon,
	LockClosedIcon,
	PhoneIcon,
	Square3Stack3DIcon,
	StarIcon,
	UserIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import nookies from 'nookies'
import Router from 'next/router'
import capitalFirst from '@/utils/capitalFirst'
import ParticlesBackground from '@/components/ParticlesBackground'
import GuestLayout from '@/components/GuestLayout'

export async function getServerSideProps(ctx) {
	await registerMeetingPage(ctx)
	const _id_meeting = nookies.get(ctx)._id_meeting

	const meeting = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/meetings/show/${_id_meeting}`,
	)

	const s_meeting = await meeting.json()

	if (s_meeting.meeting == null) {
		nookies.destroy(null, '_id_meeting')
		ctx.res.writeHead(302, { Location: `/scan` }).end()
	}

	const categories = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/categories/${s_meeting.meeting.user._id}`,
	)

	const s_categories = await categories.json()

	const users = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users`)

	const s_users = await users.json()

	return {
		props: {
			categories: s_categories.categories,
			users: s_users.users,
			meeting: s_meeting.meeting,
		},
	}
}

const Register = ({ categories, users, meeting }) => {
	const [fields, setFields] = useState({ email: '', name: '', phone: '' })
	const [errors, setErrors] = useState([])
	const [status, setStatus] = useState(0)

	async function registerHandler(e) {
		e.preventDefault()

		setStatus(1)

		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/participants/${meeting._id}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(fields),
			},
		)

		const res = await req.json()

		if (res.success == false) {
			setStatus(0)
			setErrors(res.error)
			return
		}

		nookies.destroy(null, '_id_meeting')

		Router.push(`/check_in/${res.participant._id}`)
	}

	function cancelHandler() {
		const { _id_meeting } = nookies.get()
		if (_id_meeting) nookies.destroy(null, '_id_meeting')
		Router.push('/scan')
	}

	function fieldHandler(e) {
		const name = e.target.getAttribute('name')

		setFields({
			...fields,
			[name]: e.target.value,
		})
	}

	return (
		<GuestLayout>
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
								htmlFor='name'
							>
								Rapat
							</label>
							<div className='flex items-center'>
								<div className='grid place-items-center bg-zinc-800 text-white min-h-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] max-w-[2.5rem] rounded-l-lg'>
									<AtSymbolIcon className='w-4' />
								</div>
								<input
									className='py-2 focus:outline-none w-full px-4 bg-zinc-200 rounded-r-lg text-zinc-600 ring ring-transparent focus:ring-indigo-600 transition-all duration-200'
									placeholder='example@domain.id'
									value={meeting.event}
									disabled
									type='text'
									name='name'
								/>
							</div>
						</div>
						<div className='space-y-2'>
							<label
								className='font-bold text-zinc-800'
								htmlFor='name'
							>
								Nama
							</label>
							<div className='flex items-center'>
								<div className='grid place-items-center bg-zinc-800 text-white min-h-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] max-w-[2.5rem] rounded-l-lg'>
									<UserIcon className='w-4' />
								</div>
								<input
									className='py-2 focus:outline-none w-full px-4 bg-zinc-200 rounded-r-lg text-zinc-600 ring ring-transparent focus:ring-indigo-600 transition-all duration-200'
									placeholder='Abi Noval Fauzi'
									type='text'
									name='name'
									id='name'
									onInput={fieldHandler.bind(this)}
								/>
							</div>
							{errors && errors.name ? (
								<span className='text-sm text-red-600 font-medium inline-block'>
									{capitalFirst(errors.name)}
								</span>
							) : undefined}
						</div>
						{/* <div className='space-y-2'>
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
							{errors && errors.email ? (
								<span className='text-sm text-red-600 font-medium inline-block'>
									{capitalFirst(errors.email)}
								</span>
							) : undefined}
						</div>
						<div className='space-y-2'>
							<label
								className='font-bold text-zinc-800'
								htmlFor='phone'
							>
								Telepon
							</label>
							<div className='flex items-center'>
								<div className='grid place-items-center bg-zinc-800 text-white min-h-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] max-w-[2.5rem] rounded-l-lg'>
									<PhoneIcon className='w-4' />
								</div>
								<input
									className='py-2 focus:outline-none w-full px-4 bg-zinc-200 rounded-r-lg text-zinc-600 ring ring-transparent focus:ring-indigo-600 transition-all duration-200'
									placeholder='+62xxxxxxxxxx'
									type='tel'
									name='phone'
									onInput={fieldHandler.bind(this)}
								/>
							</div>
							{errors && errors.phone ? (
								<span className='text-sm text-red-600 font-medium inline-block'>
									{capitalFirst(errors.phone)}
								</span>
							) : undefined}
						</div>
						<div className='space-y-2'>
							<label
								className='font-bold text-zinc-800'
								htmlFor='category'
							>
								Kategori
							</label>
							<div className='flex items-center'>
								<div className='grid place-items-center bg-zinc-800 text-white min-h-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] max-w-[2.5rem] rounded-l-lg'>
									<Square3Stack3DIcon className='w-4' />
								</div>
								<select
									className='py-2 focus:outline-none w-full px-4 bg-zinc-200 rounded-r-lg text-zinc-600 ring ring-transparent focus:ring-indigo-600 transition-all duration-200'
									name='category'
									onInput={fieldHandler.bind(this)}
									defaultValue={''}
								>
									<option disabled value={''}>
										- Pilih -
									</option>
									{categories.map((category) => (
										<option
											key={category._id}
											value={category._id}
										>
											{category.name}
										</option>
									))}
								</select>
							</div>
							{errors && errors.category ? (
								<span className='text-sm text-red-600 font-medium inline-block'>
									{capitalFirst(errors.category)}
								</span>
							) : undefined}
						</div>
						<div className='space-y-2'>
							<label
								className='font-bold text-zinc-800'
								htmlFor='user'
							>
								Instansi
							</label>
							<div className='flex items-center'>
								<div className='grid place-items-center bg-zinc-800 text-white min-h-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] max-w-[2.5rem] rounded-l-lg'>
									<BuildingOfficeIcon className='w-4' />
								</div>
								<select
									className='py-2 focus:outline-none w-full px-4 bg-zinc-200 rounded-r-lg text-zinc-600 ring ring-transparent focus:ring-indigo-600 transition-all duration-200'
									name='user'
									onInput={fieldHandler.bind(this)}
									defaultValue={''}
								>
									<option disabled value={''}>
										- Pilih -
									</option>
									{users.map((user) => (
										<option key={user._id} value={user._id}>
											{user.name}
										</option>
									))}
								</select>
							</div>
							{errors && errors.user ? (
								<span className='text-sm text-red-600 font-medium inline-block'>
									{capitalFirst(errors.user)}
								</span>
							) : undefined}
						</div> */}
						<div className='space-y-2'>
							<label
								className='font-bold text-zinc-800'
								htmlFor='institute'
							>
								Instansi
							</label>
							<div className='flex items-center'>
								<div className='grid place-items-center bg-zinc-800 text-white min-h-[2.5rem] min-w-[2.5rem] max-h-[2.5rem] max-w-[2.5rem] rounded-l-lg'>
									<BuildingOfficeIcon className='w-4' />
								</div>
								<input
									className='py-2 focus:outline-none w-full px-4 bg-zinc-200 rounded-r-lg text-zinc-600 ring ring-transparent focus:ring-indigo-600 transition-all duration-200'
									placeholder='SMK Wikrama Bogor'
									type='text'
									name='institute'
									id='institute'
									onInput={fieldHandler.bind(this)}
								/>
							</div>
							{errors && errors.institute ? (
								<span className='text-sm text-red-600 font-medium inline-block'>
									{capitalFirst(errors.institute)}
								</span>
							) : undefined}
						</div>
					</div>
					<div className='flex sm:flex-row flex-col items-center gap-4'>
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
							type='button'
							onClick={cancelHandler}
							className={`py-2 w-full px-4 bg-red-200 text-red-600 rounded font-semibold ring ring-transparent focus:ring-red-600 transition-all duration-200 inline-block text-center`}
						>
							Batal
						</button>
					</div>
				</form>
			</div>
		</GuestLayout>
	)
}

export default Register
