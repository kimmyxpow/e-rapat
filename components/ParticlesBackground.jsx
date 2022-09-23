import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import { useCallback, useEffect, useState } from 'react'
import Config from 'particles.config'

const ParticlesBackground = ({ status }) => {
	const particlesInit = useCallback(async (engine) => {
		console.log(engine)
		await loadFull(engine)
	}, [])

	const particlesLoaded = useCallback(async (container) => {
		await console.log(container)
	}, [])

	const [config, setConfig] = useState(Config.particlesConfig)

	useEffect(() => {
		if (status == 'success') setConfig(Config.fireworksConfig)
		if (status == 'welcome') setConfig(Config.confettiConfig)
	}, [])

	return (
		<Particles
			id='tsparticles'
			init={particlesInit}
			loaded={particlesLoaded}
			options={config}
		></Particles>
	)
}

export default ParticlesBackground
