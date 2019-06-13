import Subtitler from './components/subtitler.vue'
import tracksBuilder from './components/tracksbuilder.vue'

panel.plugin('sylvainjule/subtitler', {
    sections: {
        subtitler: Subtitler
    },
    fields: {
        tracksbuilder: tracksBuilder
    }
});