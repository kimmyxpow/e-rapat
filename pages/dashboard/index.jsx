import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Layout from '@/components/Layout'
import { authPage } from '@/middlewares/authorization'
import nookies from 'nookies'
import { useEffect, useState } from 'react'
import { QRCode } from 'react-qrcode-logo'
import moment from 'moment/moment'

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx)
	const { _id, role } = JSON.parse(nookies.get(ctx)._user)
	const url =
		role == 'admin'
			? `${
					process.env.NEXT_PUBLIC_BASE_API
			  }/meetings/${_id}?date=${moment().format('YYYY-MM-DD')}`
			: `${
					process.env.NEXT_PUBLIC_BASE_API
			  }/meetings?date=${moment().format('YYYY-MM-DD')}`

	const meetings = await fetch(url, {
		headers: {
			Authorization: 'Bearer ' + token,
		},
	})
	const s_meetings = await meetings.json()

	return { props: { token, s_meetings: s_meetings.meetings, role, _id } }
}

const Index = ({ token, s_meetings, role, _id }) => {
	const [meetings, setMeetings] = useState(s_meetings)

	const loadMeetings = async (s = '') => {
		const url =
			role == 'admin'
				? `${
						process.env.NEXT_PUBLIC_BASE_API
				  }/meetings/${_id}?search=${s}&date=${moment().format(
						'YYYY-MM-DD',
				  )}`
				: `${
						process.env.NEXT_PUBLIC_BASE_API
				  }/meetings?search=${s}&date=${moment().format('YYYY-MM-DD')}`

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

	return (
		<Layout title='Rapat Hari Ini'>
			<div className='space-y-4'>
				<div className='flex justify-between flex-wrap gap-x-2 gap-y-4'>
					<div className='bg-zinc-200 px-4 rounded-lg flex items-center gap-2 ring ring-transparent focus-within:ring-indigo-600 transition-all duration-200 lg:w-auto w-full'>
						<MagnifyingGlassIcon className='w-5 text-zinc-800' />
						<input
							className='focus:outline-none py-2.5 bg-transparent text-zinc-600'
							type='text'
							placeholder='Cari rapat...'
							onInput={(e) => {
								loadMeetings(e.target.value)
							}}
						/>
					</div>
				</div>
				<div className='table'>
					<table>
						<thead>
							<tr>
								<th className='!text-left'>Acara</th>
								<th>Waktu</th>
								<th>Tempat</th>
								{role == 'super_admin' && (
									<th>User/Instansi</th>
								)}
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
										<td>{meeting.time}</td>
										<td>{meeting.place}</td>
										{role == 'super_admin' && (
											<td>{meeting.user.name}</td>
										)}
									</tr>
								))
							) : (
								<tr>
									<td colSpan={4}>Tidak ada data</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	)
}

export default Index
