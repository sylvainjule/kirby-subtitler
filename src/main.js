import Subtitler from './components/subtitler.vue'
import Coordinator from './helpers/coordinator.js'

panel.plugin('sylvainjule/subtitler', {
	use: [Coordinator],
    sections: {
        subtitler: Subtitler
    }
});