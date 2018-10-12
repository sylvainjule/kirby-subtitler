export default function(Vue) {

Vue.prototype.$subtitler = new Vue({
    data() {
        return {
	        fields: [],
	        Subtitlers: [],
	        updatingSubtitlers: false,
	        updatingFields: false,
        }
    },
    methods: {
        getAcceptedType(field) {
	        let component = Vue.options.components['k-' + field.type + '-field']
	        if (!component) {
	          console.warn('Subtitler could not update form: Unknown field type "' + field.type + '"')
	          return null
	        }
	        return component.options.props.value.type
        },
        updateFields(datapoint, fieldname, value) {
	        if(this.updatingSubtitlers) return 
	        
	        this.updatingFields = true
	        //update fields
	        this.fields.forEach((section) => {
	            if(fieldname in section.fields) {            
	            	let type = this.getAcceptedType(section.fields[fieldname])
	            	if (!type) return

		            switch(datapoint) {
		              	case 'sub':
		                	//is this field structure like?
		                	let fields = section.fields[fieldname].fields
		                	if(fields) {
		                    	section.values[fieldname] = value.map((item) => {
			                    	item = Object.assign({}, item)
			                    	return item
			                    })
		                	} else { //if not, just send it raw data
		                    	section.values[fieldname] = value
		                	}
		                    break
		              	default:
		                    section.values[fieldname] = value
		                    break            
		            }
		            section.input(section.values)
	            }
	        })
	        this.$nextTick(() => this.updatingFields = false)
        },
        updateSubtitlers(values) {
        	if(this.updatingFields) return 
        	this.updatingSubtitlers = true
        
	        this.Subtitlers.forEach((Subtitler) => {
	            for(let fieldname in values) {
	            	let value = values[fieldname]
	            	Subtitler.setValue(fieldname, value)
	            }
	        })
        	this.$nextTick(() => this.updatingSubtitlers = false)
        },
        registerSubtitler(Subtitler) {
        	this.Subtitlers.push(Subtitler)
        },
        unregisterSubtitler(Subtitler) {
        	const index = this.fields.indexOf(Subtitler);
        	if (index !== -1) {
          		this.Subtitlers.splice(index, 1);
        	}
        },
        registerFields(section) {
        	this.fields.push(section)
        },
        unregisterFields(section) {
        	const index = this.fields.indexOf(section);
        	if (index !== -1) {
            	this.fields.splice(index, 1);
          	}
        }
    }
})

// replace fields section
const original = Vue.options.components["k-fields-section"]

// Extend section events
Vue.component('k-fields-section', {
    extends: original,
    created() {
        this.$subtitler.registerFields(this)
    },
    destroyed() {
        this.$subtitler.unregisterFields(this)
    },
    methods: {
        input(values) {
	        this.values = values
	        original.options.methods.input.call(this, values)
	        this.$subtitler.updateSubtitlers(values)
        }
    },
    watch: {
        values(newValues) {
        	this.$subtitler.updateSubtitlers(newValues)
        }
    }
})

}