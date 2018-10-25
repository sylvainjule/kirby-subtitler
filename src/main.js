import Subtitler from './components/subtitler.vue'
import VttCreator from './components/vttcreator.vue'
import Coordinator from './helpers/coordinator.js'

panel.plugin('sylvainjule/subtitler', {
	use: [Coordinator],
    sections: {
        subtitler: Subtitler
    },
    fields: {
        vttcreator: VttCreator
    }
});