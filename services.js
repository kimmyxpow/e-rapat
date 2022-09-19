require('dotenv').config({ path: '.env.local' })
const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const https = require(`https`)
const { readFileSync } = require(`fs`)

const options = {
	pfx: readFileSync(process.env.PFX_FILE),
	passphrase: process.env.PFX_PASSPHRASE,
	ca: readFileSync(process.env.INTERCERT_FILE),
}

app.prepare().then(() => {
	const server = express()

	https.createServer(options, server)

	server.all('*', (req, res) => {
		return handle(req, res)
	})

	server.listen(port, () => {
		console.log(`> Ready on http://localhost:${port}`)
	})
})
