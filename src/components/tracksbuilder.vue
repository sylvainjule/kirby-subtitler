<template>
    <k-field v-bind="$attrs">
    	<div :class="['tracksbuilder-button', {error: hasError}, {processing: processing}, {success: success}]" @click="generateVttFiles">
			<span class="icon">
				<svg viewBox="0 0 16 16">
			        <use xlink:href="#icon-refresh" />
			    </svg>
			</span>
			<span class="text"><em>{{text}}</em></span>
		</div>
    </k-field>
</template>

<script>

export default {
	data() { 
		return {
			processing: false,
			hasError: false,
			success: false,
			icon: {
				type: 'refresh',
				back: 'theme-process'
			},
		}
	},
	props: {
		vttLength: Boolean,
		src: String,
		uri: String,
	},
	computed: {
		text() {
			if(this.hasError) return 'An error occured!'
			if(this.success) {
				return this.vttLength ? 'Files updated!' : 'Files created!'
			}
			if(this.processing) return 'Processing...'
			return this.vttLength ? 'Update .vtt files' : 'Create .vtt files'
		}
	},
	methods: {
		generateVttFiles() {
			this.processing = true

			this.$api.post('subtitler/generate-vtt-files', {uri: this.uri, src: this.src})
	    		.then(response => {
    				if(response.status == 'success') this.showSuccessMessage()
    				else this.showErrorMessage()
    			})
    			.catch(error => {
    				this.showErrorMessage()
				})
		},
		showErrorMessage() {
			this.processing = false
			this.hasError = true

			let self = this
			setTimeout(function() {
				self.hasError = false
			}, 3500)
		},
		showSuccessMessage() {
			this.processing = false
			this.success = true

			let self = this
			setTimeout(function() {
				self.success = false
			}, 3500)
		}
	},
}
</script>

<style lang="scss">
	@import '../assets/css/fields/tracksbuilder.scss'
</style>