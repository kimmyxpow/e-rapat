import Layout from '@/components/Layout'
import nookies from 'nookies'
import { authPage } from '@/middlewares/authorization'
import React, { Fragment, useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { QRCode } from 'react-qrcode-logo'
import { Dialog, Transition } from '@headlessui/react'
import capitalFirst from '@/utils/capitalFirst'

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx)
	const { _id } = JSON.parse(nookies.get(ctx)._user)
	const users = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users`, {
		headers: {
			Authorization: 'Bearer ' + token,
		},
	})
	const s_users = await users.json()

	return { props: { token, s_users: s_users.users, _id } }
}

const index = ({ token, s_users, _id }) => {
	const [users, setUsers] = useState(s_users)
	const [fields, setFields] = useState({
		search: '',
		d: '',
		email: '',
		password: '',
		name: '',
		address: '',
		_id: '',
	})
	const [isOpenCreate, setIsOpenCreate] = useState(false)
	const [isOpenEdit, setIsOpenEdit] = useState(false)
	const [errors, setErrors] = useState({})
	const [success, setSuccess] = useState({})

	function closeModalCreate() {
		setIsOpenCreate(false)
		setErrors({})
		setFields({ ...fields, email: '', password: '', name: '', address: '' })
	}

	function openModalCreate() {
		setIsOpenCreate(true)
	}

	function closeModalEdit() {
		setIsOpenEdit(false)
		setErrors({})
		setFields({
			...fields,
			email: '',
			password: '',
			name: '',
			address: '',
			_id: '',
		})
	}

	function openModalEdit(data, e) {
		setFields({ ...fields, ...data, password: '' })
		setIsOpenEdit(true)
	}

	const loadUsers = async () => {
		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/users/?search=${fields.search}`,
			{
				headers: {
					Authorization: 'Bearer ' + token,
				},
			},
		)

		const res = await req.json()

		setUsers(res.users)
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

		const req = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(fields),
		})

		const res = await req.json()

		if (!res.success) return setErrors(res.error)

		setSuccess(res)
		loadUsers()
		closeModalCreate()
	}

	async function editHandler(e) {
		e.preventDefault()

		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/users/${fields._id}`,
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
		loadUsers()
		closeModalEdit()
	}

	async function deleteHandler(data, e) {
		e.preventDefault()

		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/users/${data._id}`,
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
		loadUsers()
	}

	useEffect(() => {
		loadUsers()
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
								placeholder='Cari user...'
								name='search'
								onInput={fieldHandler.bind(this)}
							/>
						</div>
					</div>
					<button
						onClick={openModalCreate}
						className={`py-2.5 px-6 bg-green-600 rounded-lg text-white font-semibold ring ring-transparent focus:ring-green-400 transition-all duration-200 inline-block sm:w-auto w-full`}
					>
						Create
					</button>
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
								<th className='!text-left'>Nama</th>
								<th>Email</th>
								<th>Alamat</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{users.length > 0 ? (
								users.map((user) => (
									<tr key={user._id}>
										<td className='!text-left'>
											{user.name}
										</td>
										<td>{user.email}</td>
										<td>{user.address}</td>
										<td className='space-x-2'>
											<button
												onClick={openModalEdit.bind(
													this,
													user,
												)}
												className={`py-2 px-6 bg-orange-600 rounded-md text-white font-semibold ring ring-transparent focus:ring-orange-400 transition-all duration-200 inline-block`}
											>
												Edit
											</button>
											<button
												onClick={deleteHandler.bind(
													this,
													user,
												)}
												className={`py-2 px-6 bg-red-600 rounded-md text-white font-semibold ring ring-transparent focus:ring-red-400 transition-all duration-200 inline-block`}
											>
												Delete
											</button>
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
										Create User
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
													Nama
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='text'
													name='name'
													id='name'
													onInput={fieldHandler.bind(
														this,
													)}
													placeholder='Ketik disini...'
												/>
												{errors && errors.name ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.name,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='email'
												>
													Email
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='email'
													name='email'
													onChange={fieldHandler.bind(
														this,
													)}
													placeholder='Ketik disini...'
													id='email'
												/>
												{errors && errors.email ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.email,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='password'
												>
													Password
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='password'
													name='password'
													onChange={fieldHandler.bind(
														this,
													)}
													placeholder='Ketik disini...'
													id='password'
												/>
												{errors && errors.password ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.password,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='address'
												>
													address
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='text'
													name='address'
													id='address'
													onInput={fieldHandler.bind(
														this,
													)}
													placeholder='Ketik disini...'
												/>
												{errors && errors.address ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.address,
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
										Edit User
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
													Nama
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='text'
													name='name'
													id='name'
													onInput={fieldHandler.bind(
														this,
													)}
													value={fields.name}
													placeholder='Ketik disini...'
												/>
												{errors && errors.name ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.name,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='email'
												>
													Email
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='email'
													name='email'
													onChange={fieldHandler.bind(
														this,
													)}
													value={fields.email}
													id='email'
												/>
												{errors && errors.email ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.email,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='password'
												>
													Password
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='password'
													name='password'
													onChange={fieldHandler.bind(
														this,
													)}
													value={fields.password}
													id='password'
												/>
												{errors && errors.password ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.password,
														)}
													</span>
												) : undefined}
											</div>
											<div className='grid gap-2'>
												<label
													className='font-semibold text-zinc-600'
													htmlFor='address'
												>
													address
												</label>
												<input
													className='py-2.5 px-6 focus:outline-none ring ring-transparent focus:ring-indigo-600 text-zinc-600 rounded-lg transition-all duration-300 lg:w-auto w-full bg-zinc-200'
													type='text'
													name='address'
													id='address'
													onInput={fieldHandler.bind(
														this,
													)}
													value={fields.address}
													placeholder='Ketik disini...'
												/>
												{errors && errors.address ? (
													<span className='text-sm text-red-600 font-medium capitalize'>
														{capitalFirst(
															errors.address,
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
