import Layout from '@/components/Layout'
import nookies from 'nookies'
import { authPage } from '@/middlewares/authorization'
import React, { Fragment, useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { QRCode } from 'react-qrcode-logo'
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import capitalFirst from '@/utils/capitalFirst'

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx)
	const { _id, role } = JSON.parse(nookies.get(ctx)._user)
	const url =
		role == 'admin'
			? `${process.env.NEXT_PUBLIC_BASE_API}/meetings/${_id}`
			: `${process.env.NEXT_PUBLIC_BASE_API}/meetings`
	const meetings = await fetch(url, {
		headers: {
			Authorization: 'Bearer ' + token,
		},
	})
	const s_meetings = await meetings.json()

	return { props: { token, s_meetings: s_meetings.meetings, _id, role } }
}

const index = ({ token, s_meetings, _id, role }) => {
	const [meetings, setMeetings] = useState(s_meetings)
	const [fields, setFields] = useState({
		search: '',
		d: '',
		event: '',
		date: '',
		time: '',
		place: '',
		_id: '',
	})
	const [isOpenCreate, setIsOpenCreate] = useState(false)
	const [isOpenEdit, setIsOpenEdit] = useState(false)
	const [errors, setErrors] = useState({})
	const [success, setSuccess] = useState({})

	function closeModalCreate() {
		setIsOpenCreate(false)
		setErrors({})
		setFields({ ...fields, event: '', date: '', time: '', place: '' })
	}

	function openModalCreate() {
		setIsOpenCreate(true)
	}

	function closeModalEdit() {
		setIsOpenEdit(false)
		setErrors({})
		setFields({
			...fields,
			event: '',
			date: '',
			time: '',
			place: '',
			_id: '',
		})
	}

	function openModalEdit(data, e) {
		setFields({ ...fields, ...data })
		setIsOpenEdit(true)
	}

	const loadMeetings = async () => {
		const url =
			role == 'admin'
				? `${process.env.NEXT_PUBLIC_BASE_API}/meetings/${_id}?search=${
						fields.search && fields.search
				  }&date=${fields.d && fields.d}`
				: `${process.env.NEXT_PUBLIC_BASE_API}/meetings?search=${
						fields.search && fields.search
				  }&date=${fields.d && fields.d}`

		const req = await fetch(url, {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		})

		const res = await req.json()

		setMeetings(res.meetings)
	}

	function handleDownloadQR(filename, e) {
		const canvas = e.target.parentElement.querySelector('canvas')
		const url = canvas.toDataURL('image/png')
		const link = document.createElement('a')
		link.download = `${filename}.png`
		link.href = url
		link.click()
	}

	function fieldHandler(e) {
		const name = e.target.getAttribute('name')

		setFields({
			...fields,
			[name]: e.target.value,
		})
	}

	async function createHandler(e) {
		e.preventDefault()

		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/meetings/${_id}`,
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(fields),
			},
		)

		const res = await req.json()

		if (!res.success) return setErrors(res.error)

		setSuccess(res)
		loadMeetings()
		closeModalCreate()
	}

	async function editHandler(e) {
		e.preventDefault()

		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/meetings/${_id}/${fields._id}`,
			{
				method: 'PUT',
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(fields),
			},
		)

		const res = await req.json()

		if (!res.success) return setErrors(res.error)

		setSuccess(res)
		loadMeetings()
		closeModalEdit()
	}

	async function deleteHandler(data, e) {
		e.preventDefault()

		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/meetings/${_id}/${data._id}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'application/json',
				},
			},
		)

		const res = await req.json()

		if (!res.success) return setErrors(res.error)

		setSuccess(res)
		loadMeetings()
	}

	useEffect(() => {
		loadMeetings()
	}, [fields])

	return (
		<Layout title='Rapat'>
			<div className='space-y-4'>
				<div className='flex justify-between items-center flex-wrap gap-x-2 gap-y-4'>
					<div className='flex gap-2 flex-wrap sm:w-auto w-full'>
						<div className='bg-zinc-200 px-4 rounded-lg flex items-center gap-2 ring ring-transparent focus-within:ring-indigo-600 transition-all duration-200 sm:w-auto w-full'>
							<MagnifyingGlassIcon className='w-5 text-zinc-800' />
							<input
								className='focus:outline-none py-2.5 bg-transparent text-zinc-600'
								type='text'
								placeholder='Cari rapat...'
								name='search'
								onInput={fieldHandler.bind(this)}
							/>
						</div>
						{role == 'admin' && (
							<input
								className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 sm:w-auto w-full'
								type='date'
								name='d'
								id='d'
								onChange={fieldHandler.bind(this)}
							/>
						)}
					</div>
					{role == 'admin' && (
						<button
							onClick={openModalCreate}
							className={`py-2.5 px-6 bg-green-600 rounded-lg text-white font-semibold ring ring-transparent focus:ring-green-400 transition-all duration-200 inline-block sm:w-auto w-full`}
						>
							Create
						</button>
					)}
				</div>
				{success.success && (
					<span className='block py-3 px-8 rounded-lg bg-green-200 text-green-600 border border-green-400 text-center'>
						{success.message}
					</span>
				)}
				<div className='table'>
					<table>
						<thead>
							<tr>
								<th className='!text-left'>Acara</th>
								<th>Tanggal</th>
								<th>Waktu</th>
								<th>Tempat</th>
								{role == 'super_admin' && (
									<th>User/Instansi</th>
								)}
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{meetings.length > 0 ? (
								meetings.map((meeting) => (
									<tr key={meeting._id}>
										<td className='flex items-center gap-2'>
											<button
												onClick={handleDownloadQR.bind(
													this,
													`ERAPATQR - ${meeting.event}`,
												)}
											>
												<QRCode
													enableCORS={true}
													size='150'
													logoImage='/img/lskk.png'
													value={meeting._id}
													logoWidth='60'
													eyeRadius={[
														{
															outer: [
																10, 10, 0, 10,
															],
															inner: [0, 5, 5, 5],
														},
														{
															outer: [
																10, 10, 10, 0,
															],
															inner: [5, 0, 5, 5],
														},
														{
															outer: [
																10, 0, 10, 10,
															],
															inner: [5, 5, 5, 0],
														},
													]}
													eyeColor={{
														outer: '#1e40af',
														inner: '#1e40af',
													}}
													qrStyle='square'
													id={meeting._id}
												/>
											</button>
											<span className='!text-left align-middle'>
												{meeting.event}
											</span>
										</td>
										<td>{meeting.date}</td>
										<td>{meeting.time}</td>
										<td>{meeting.place}</td>
										{role == 'super_admin' && (
											<td>{meeting.user.name}</td>
										)}
										<td className='space-x-2'>
											{role == 'admin' ? (
												<>
													<button
														onClick={openModalEdit.bind(
															this,
															meeting,
														)}
														className={`py-2 px-6 bg-orange-600 rounded-md text-white font-semibold ring ring-transparent focus:ring-orange-400 transition-all duration-200 inline-block`}
													>
														Edit
													</button>
													<button
														onClick={deleteHandler.bind(
															this,
															meeting,
														)}
														className={`py-2 px-6 bg-red-600 rounded-md text-white font-semibold ring ring-transparent focus:ring-red-400 transition-all duration-200 inline-block`}
													>
														Delete
													</button>
												</>
											) : (
												<Link
													href={`/dashboard/meetings/${meeting._id}`}
												>
													<a
														className={`py-2 px-6 bg-indigo-600 rounded-md text-white font-semibold ring ring-transparent focus:ring-indigo-400 transition-all duration-200 inline-block`}
													>
														Lihat Peserta
													</a>
												</Link>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={5}>Tidak ada data</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modal Create */}
			<Transition appear show={isOpenCreate} as={Fragment}>
				<Dialog
					as='div'
					className='relative z-10'
					onClose={closeModalCreate}
				>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black bg-opacity-25' />
					</Transition.Child>

					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-10 py-8 text-left align-middle shadow-xl transition-all space-y-6'>
									<Dialog.Title
										as='h3'
										className='text-xl font-bold text-zinc-800'
									>
										Create Rapat
									</Dialog.Title>

									<form
										action='#'
										onSubmit={createHandler.bind(this)}
										className='space-y-6'
									>
										<div className='grid gap-5'>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='event'
												>
													Acara
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='text'
													name='event'
													id='event'
													onInput={fieldHandler.bind(
														this,
													)}
													placeholder='Ketik disini...'
												/>
												{errors && errors.event ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.event,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='date'
												>
													Tanggal
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='date'
													name='date'
													onChange={fieldHandler.bind(
														this,
													)}
													id='date'
												/>
												{errors && errors.date ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.date,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='time'
												>
													Waktu
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='time'
													name='time'
													onChange={fieldHandler.bind(
														this,
													)}
													id='time'
												/>
												{errors && errors.time ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.time,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='place'
												>
													Tempat
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='text'
													name='place'
													id='place'
													onInput={fieldHandler.bind(
														this,
													)}
													placeholder='Ketik disini...'
												/>
												{errors && errors.place ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.place,
														)}
													</span>
												) : undefined}
											</div>
										</div>
										<div className='grid grid-cols-2 gap-2'>
											<button
												className={`py-2.5 px-6 bg-indigo-600 rounded-lg text-white font-semibold ring ring-transparent focus:ring-indigo-400 transition-all duration-200 inline-block`}
											>
												Store
											</button>
											<button
												type='button'
												className={`py-2.5 px-6 bg-red-200 rounded-lg text-red-600 font-semibold ring ring-transparent focus:ring-red-400 transition-all duration-200 inline-block`}
												onClick={closeModalCreate}
											>
												Cancel
											</button>
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>

			{/* Modal Update */}
			<Transition appear show={isOpenEdit} as={Fragment}>
				<Dialog
					as='div'
					className='relative z-10'
					onClose={closeModalEdit}
				>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black bg-opacity-25' />
					</Transition.Child>

					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-10 py-8 text-left align-middle shadow-xl transition-all space-y-6'>
									<Dialog.Title
										as='h3'
										className='text-xl font-bold text-zinc-800'
									>
										Edit Rapat
									</Dialog.Title>

									<form
										action='#'
										onSubmit={editHandler.bind(this)}
										className='space-y-6'
									>
										<div className='grid gap-5'>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='event'
												>
													Acara
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='text'
													name='event'
													id='event'
													onInput={fieldHandler.bind(
														this,
													)}
													value={fields.event}
													placeholder='Ketik disini...'
												/>
												{errors && errors.event ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.event,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='date'
												>
													Tanggal
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='date'
													name='date'
													onChange={fieldHandler.bind(
														this,
													)}
													value={fields.date}
													id='date'
												/>
												{errors && errors.date ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.date,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='time'
												>
													Waktu
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='time'
													name='time'
													onChange={fieldHandler.bind(
														this,
													)}
													value={fields.time}
													id='time'
												/>
												{errors && errors.time ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.time,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='place'
												>
													Tempat
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='text'
													name='place'
													id='place'
													onInput={fieldHandler.bind(
														this,
													)}
													value={fields.place}
													placeholder='Ketik disini...'
												/>
												{errors && errors.place ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.place,
														)}
													</span>
												) : undefined}
											</div>
										</div>
										<div className='grid grid-cols-2 gap-2'>
											<button
												className={`py-2.5 px-6 bg-indigo-600 rounded-lg text-white font-semibold ring ring-transparent focus:ring-indigo-400 transition-all duration-200 inline-block`}
											>
												Update
											</button>
											<button
												type='button'
												className={`py-2.5 px-6 bg-red-200 rounded-lg text-red-600 font-semibold ring ring-transparent focus:ring-red-400 transition-all duration-200 inline-block`}
												onClick={closeModalEdit}
											>
												Cancel
											</button>
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</Layout>
	)
}

export default index
