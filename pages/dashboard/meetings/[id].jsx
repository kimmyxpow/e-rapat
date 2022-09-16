import Layout from '@/components/Layout'
import { authPage } from '@/middlewares/authorization'
import React, { Fragment, useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx)
	const { id } = ctx.query
	const participants = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/meetings/participants/${id}`,
	)
	const s_participants = await participants.json()

	return { props: { token, s_participants: s_participants.participants, id } }
}

const Participants = ({ token, s_participants, id }) => {
	const [participants, setParticipants] = useState(s_participants)
	const [fields, setFields] = useState({
		search: '',
	})

	const loadParticipants = async () => {
		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_API}/meetings/participants/${id}?search=${fields.search}`,
		)

		const res = await req.json()

		setParticipants(res.participants)
	}

	function fieldHandler(e) {
		const name = e.target.getAttribute('name')

		setFields({
			...fields,
			[name]: e.target.value,
		})
	}

	useEffect(() => {
		loadParticipants()
	}, [fields])

	return (
		<Layout title='Peserta Rapat'>
			<div className='space-y-4'>
				<div className='flex justify-between items-center flex-wrap gap-x-2 gap-y-4'>
					<div className='flex gap-2 flex-wrap sm:w-auto w-full'>
						<div className='bg-zinc-200 px-4 rounded-lg flex items-center gap-2 ring ring-transparent focus-within:ring-indigo-600 transition-all duration-200 sm:w-auto w-full'>
							<MagnifyingGlassIcon className='w-5 text-zinc-800' />
							<input
								className='focus:outline-none py-2.5 bg-transparent text-zinc-600'
								type='text'
								placeholder='Cari peserta...'
								name='search'
								onInput={fieldHandler.bind(this)}
							/>
						</div>
					</div>
				</div>
				<div className='table'>
					<table>
						<thead>
							<tr>
								<th className='!text-left'>Name</th>
								<th>Email</th>
								<th>Phone</th>
								<th>Instansi</th>
								<th>Kategori</th>
								<th>Check In</th>
								<th>Check Out</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{participants.length > 0 ? (
								participants.map((participant) => (
									<tr key={participant._id}>
										<td>{participant.name}</td>
										<td>{participant.email}</td>
										<td>{participant.phone}</td>
										<td>{participant.user.name}</td>
										<td>{participant.category.name}</td>
										<td>{participant.in || '-'}</td>
										<td>{participant.out || '-'}</td>
										<td>{participant.status}</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan={100}>Tidak ada data</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	)
}

export default Participants
