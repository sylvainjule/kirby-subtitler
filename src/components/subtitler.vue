<template>
	<div class="subtitler" :data-theme="theme" :data-color="activeColor" @mousemove="updateCoords">
		<div class="subtitler-background"></div>

		<div v-if="!fileExists" class="subtitler-placeholder">
			<div class="subtitler-placeholder-ctn">
				Please select a file
			</div>
		</div>

		<div v-if="debug && fileExists" class="subtitler-toolbar">
			<div class="subtitler-toolbar-debug">
				<div class="coord prop">{{coords.prop}}</div>
				<div class="coord time">{{coords.time}}</div>
				<div class="coord text">{{coords.text}}</div>
			</div>
		</div>

		<div v-if="fileExists" :class="['subtitler-file', {'debug': debug}]">
			<div v-if="isVideo" class="subtitler-video">
				<div class="subtitler-video-ctn">
					<video ref="videoPlayer">
						<source :src="src.url"></source>
					</video>
				</div>
			</div>
			<div v-if="isAudio" class="subtitler-audio">
				<div class="audio-icon">
					<audio-file />
				</div>
				<audio ref="audioPlayer">
					<source :src="src.url"></source>
				</audio>
			</div>
		</div>

		<div v-if="fileExists" class="subtitler-editor">
			<div class="subtitler-editor-firstline">
				<div class="left">
					<button class="play" @click="playPause">
						<play-icon v-if="!isPlaying" />
						<pause-icon v-if="isPlaying" />
					</button>
					<div v-if="activeTimeline" class="range-buttons">
						<button :class="['range-button start', {disabled: disableStart}, {active: startExists}]" @click="setStart">{</button>
						<arrow-icon v-if="startExists" />
						<button v-if="startExists" :class="['range-button end', {disabled: disableEnd}]" class="range-button end" @click="setEnd">}</button>
					</div>
				</div>
				<div ref="timeline" class="right">
					<div class="duration">{{duration.text}}</div>
				</div>
			</div>
			<div class="subtitler-editor-timelines">
				<div v-for="(timeline, index) in timelines" :class="['timeline', {'active': timeline == active}, {'inactive': activeTimeline && timeline != active}]" :data-theme="timeline.color">
					<div class="left">
						<div class="tick-wrapper">
							<div class="tick" @click="setActive(timeline)"><edit-icon /></div>
						</div>
						<div class="name">{{label(timeline)}}</div>
						<div class="count-wrapper">
							<div class="count">{{timelineSubs(timeline).length}}</div>
						</div>
					</div>
					<div class="right">
						<div class="subs">
							<div v-for="(sub, index) in timelineSubs(timeline)" class="sub" :style="'left:'+ sub.startprop * 100 +'%; width:'+ (sub.endprop - sub.startprop) * 100 +'%;'">
								<div class="sub-handle sub-handle-left" @mousedown="initResize(sub, 'left')"></div>
								<div class="sub-index">{{subs.indexOf(sub) + 1}}</div>
								<div class="sub-handle sub-handle-right" @mousedown="initResize(sub, 'right')"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="subtitler-editor-progress">
				<div v-if="currentTime.text != ''" class="bar" :style="'width:'+ currentTime.prop * 100 + '%;'">
					<div class="handle" @mousedown="onHandleMouseDown"></div>
					<div class="current-time">{{currentTime.text}}</div>
				</div>
			</div>
			<div class="subtitler-editor-range">
				<div v-if="startExists" class="start" :style="'left:'+ start.prop * 100 + '%;'">
					<div class="start-time">{{start.text}}</div>
				</div>
				<div v-if="endExists" class="end" :style="'left:'+ end.prop * 100 + '%;'">
					<div class="end-time">{{end.text}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AudioFile from './icons/audio-file.vue'
import PlayIcon from './icons/play.vue'
import PauseIcon from './icons/pause.vue'
import EditIcon from './icons/edit.vue'
import ArrowIcon from './icons/arrow.vue'

export default {
	components: {AudioFile, PlayIcon, PauseIcon, EditIcon, ArrowIcon},
	data() {
		return {
			src: {
				id: '',
				type: '',
				url: '',
			},
			resize: {
				isResizing: false,
				handle: String,
				index: Number,
				max: Number,
				min: Number,
			},
			loaded: false,
			isPlaying: false,
			active: null,
			subs: [
			],
			coords: {
				time: 0,
				prop: 0,
				text: ''
			},
			currentTime: {
				time: 0,
				prop: 0,
				text: ''
			},
			duration: {
				time: 0,
				text: ''
			},
			start: {
				time: 0,
				prop: 0,
				text: ''
			},
			end: {
				time: 0,
				prop: 0,
				text: ''
			}
		}
	},
	props: {
		storage: Object,
		theme: String,
        file: String,
		debug: Boolean,
		timelines: Object,
	},
	computed: {
		isAudio: function() {
			return this.src.type == 'audio'
		},
		isVideo: function() {
			return this.src.type == 'video'
		},
		currentPlayer: function() {
			return this.isAudio ? this.$refs.audioPlayer : this.$refs.videoPlayer
		},
		activeTimeline: function() {
			return this.active != null
		},
		activeColor: function() {
			return this.activeTimeline ? this.active.color : false
		},
		fileExists: function() {
			return this.src.url && this.src.type
		},
		startExists: function() {
			return this.start.time > 0
		},
		endExists: function() {
			return this.end.time > 0
		},
		disableStart: function() {
			return !this.startExists && this.isOverlapping
		},
		disableEnd: function() {
			return this.isBeforeStart || this.isAfterNextSub || this.startIsOverlapping
		},
		isOverlapping: function() {
			let overlap = false

			for(let sub of this.timelineSubs(this.active)) {
				if(this.currentTime.prop >= sub.startprop && this.currentTime.prop <= sub.endprop) {
					overlap = true
					break;
				}
			}

			return overlap
		},
		startIsOverlapping: function() {
			let overlap = false

			for(let sub of this.timelineSubs(this.active)) {
				if(this.start.prop >= sub.startprop && this.start.prop <= sub.endprop) {
					overlap = true
					break;
				}
			}

			return overlap
		},
		isBeforeStart: function() {
			return this.currentTime.time <= this.start.time
		},
		isAfterNextSub: function() {
			let nextSub = this.getNextSub(this.start.prop)

			if(nextSub) { return this.currentTime.prop >= nextSub.startprop }
			else { return false }
		},
		id() {
	      	return this.$store.state.content.current
	    },
	    pageValues() {
	    	return this.$store.getters["content/values"](this.id)
	    }
	},
	watch: {
		pageValues: {
			immediate: true,
			handler() {
				this.updateValues()
			}
		}
    },
	created() {
		this.load()
	        .then(response => {
	        	this.theme     = response.theme
	        	this.debug     = response.debug
	        	this.storage   = response.storage
	        	this.timelines = response.timelines
	        	this.storage   = response.storage
	        	this.lang      = response.lang
	        	if(response.file) {
	        		this.src.url  = response.file.url
	        		this.src.type = response.file.type
	        	}
	        })

	    document.addEventListener('mouseup', this.stopResizing)
	},
	destroyed() {
	    document.removeEventListener('mouseup', this.stopResizing)
	},
	methods: {
		init() {
			this.currentPlayer.addEventListener('timeupdate', this.timeUpdate)
            this.currentPlayer.addEventListener('loadeddata', this.loadedData)
            this.loaded = true
		},
		loadedData() {
			if (this.currentPlayer.readyState >= 2) {
                this.setDuration()
                this.syncCurrentTime(0)
            }
		},
		timeUpdate(e) {
            let currentTime = this.currentPlayer.currentTime
            if (!this.loaded && currentTime > 0) { this.loaded = true }

            this.syncCurrentTime(currentTime)
            if (currentTime == this.duration.time && this.isPlaying) {
                this.playPause()
            }
        },
		playPause() {
			let _player = this.currentPlayer
			if (this.duration.time == 0) this.setDuration()

			if(this.isPlaying) {
				_player.pause()
				this.isPlaying = false
			}
			else {
				_player.play()
				this.isPlaying = true
			}
		},
		updateCoords(e) {
			let _timeline = this.$refs.timeline
			if(!_timeline) return false

			let _bounds = _timeline.getBoundingClientRect()
			let _width  = _timeline.clientWidth

  			let xabs = e.clientX - _bounds.left
  			let x    = xabs / _width
  			    x    = Math.max(0, Math.min(1, x.toFixed(4)))

			this.coords.prop = x
			this.coords.time = x * this.duration.time
			this.coords.text = this.formatTime(this.coords.time)

			if(this.resize.isResizing) this.resizeSub(e)
		},
		initResize(sub, handle) {
			if(!this.active) return false

			this.resize.index        = this.subs.indexOf(sub)
			this.resize.isResizing   = true
			this.resize.handle       = handle

			if (handle == 'left') {
				let prevSub = this.getPrevSub(parseFloat(sub.startprop))

				this.resize.min = prevSub ? parseFloat(prevSub.endprop) + 0.0001 : 0
				this.resize.max = parseFloat(sub.endprop) - 0.0001
			}
			else if (handle == 'right') {
				let nextSub = this.getNextSub(parseFloat(sub.startprop))

				this.resize.min = parseFloat(sub.startprop) + 0.0001
				this.resize.max = nextSub ? parseFloat(nextSub.startprop) - 0.0001 : 1
			}
		},
		resizeSub(e) {
			let _sub = this.subs[this.resize.index]

			if(this.resize.handle == 'left') {
				let newStart = Math.min(this.resize.max, Math.max(this.resize.min, this.coords.prop))
				_sub.startprop = newStart
				_sub.start     = newStart * this.duration.time
			}
			if(this.resize.handle == 'right') {
				let newEnd = Math.min(this.resize.max, Math.max(this.resize.min, this.coords.prop))
				_sub.endprop = newEnd
				_sub.end     = newEnd * this.duration.time
			}
		},
		stopResizing(e) {
			if (!this.resize.isResizing) return false

			this.updateStructure()

			this.resize.isResizing = false
			this.resize.handle = String
			this.resize.index = Number
			this.resize.max = Number
			this.resize.min = Number
		},
        onHandleMouseDown(e) {
            document.addEventListener('mousemove', this.onDocumentMouseMove)
            document.addEventListener('mouseup', this.onDocumentMouseUp)
        },
        onDocumentMouseUp(e) {
            document.removeEventListener('mouseup', this.onDocumentMouseUp)
            document.removeEventListener('mousemove', this.onDocumentMouseMove)

            this.syncProgress(e)
        },
        onDocumentMouseMove(e) {
            this.syncProgress(e)
        },
        syncProgress(e) {
	        this.currentTime.prop = this.coords.prop.toFixed(4)
			this.currentTime.time = this.coords.prop * this.duration.time
			this.currentTime.text = this.formatTime(this.coords.time)
			this.currentPlayer.currentTime = this.currentTime.time
        },
        setStart() {
			if(this.startExists) {
				this.resetStart()
				this.resetEnd()
			}
			else {
				this.start.prop = this.currentTime.prop
				this.start.text = this.currentTime.text
				this.start.time = this.currentTime.time
			}
        },
        setEnd() {
			this.end.prop = this.currentTime.prop
			this.end.text = this.currentTime.text
			this.end.time = this.currentTime.time

			// prepare the sub
			let sub = {
				start: this.start.time,
				startprop: this.start.prop,
				end: this.end.time,
				endprop: this.end.prop,
				timeline: this.active.id
			}

			// Push at the right index
			let index = this.getNewIndex()
			this.subs.splice(index, 0, sub)

			// Update the structure and reset everything
			this.updateStructure()
			this.resetStart()
			this.resetEnd()
        },
        getNextSub(xref) {
        	return this.timelineSubs(this.active).find(sub => { return sub.startprop > xref })
        },
        getPrevSub(xref) {
        	return this.timelineSubs(this.active).splice(0).reverse().find(sub => { return xref > sub.endprop })
        },
        getNewIndex() {
        	// if there's no sub
        	if(!this.subs.length) return 0

        	// if there's at least one other sub in the timeline
        	if(this.timelineSubs(this.active).length) {
	        	let nextSub = this.getNextSub(this.start.prop)
	        	// if there's a next sub, just grab its index
	        	if(nextSub) {
	        		return this.subs.indexOf(nextSub)
	        	}
	        	// otherwise, increment the one of the previous sub
	        	else {
	        		let prevSub = this.getPrevSub(this.start.prop)
	        		return this.subs.indexOf(prevSub) + 1
	        	}
	        }

	        // if the timeline has no sub
	        else {
	        	// if it's the only timeline
	        	if(this.timelines.indexOf(this.active) == 0) {
	        		return 0
	        	}
	        	// if it's not the only timeline
	        	else {
	        		// if there's at least one next timeline
	        		let nextTimelines = this.timelines.slice(this.timelines.indexOf(this.active) + 1)
	        		if(nextTimelines) {
	        			// if one of these next timelines has a sub
        				let withSubs = nextTimelines.filter(timeline => {
        					return this.timelineSubs(timeline).length
        				})
        				if(withSubs.length) {
        					let firstWithSubs = withSubs[0]
        					let firstNextSub  = this.timelineSubs(firstWithSubs)[0]
        					return this.subs.indexOf(firstNextSub)
        				}
        				// otherwise, it's the last item of the array
        				else {
        					return this.subs.length
        				}
	        		}
	        		//otherwise, it's the last item of the array
		        	else {
		        		return this.subs.length
		        	}
	        	}
	        }
        },
        resetStart() {
			this.start.prop = 0
			this.start.text = 0
			this.start.time = 0
        },
        resetEnd() {
			this.end.prop = 0
			this.end.text = 0
			this.end.time = 0
        },
		setDuration() {
			let _player = this.currentPlayer
			this.duration.time = _player.duration
			this.duration.text = this.formatTime(_player.duration)
		},
		syncCurrentTime(currentTime) {
			this.currentTime.time = currentTime
            this.currentTime.prop = (currentTime / this.duration.time).toFixed(4)
            this.currentTime.text = this.formatTime(currentTime)
		},
		setActive(timeline) {
			if(this.active == timeline) {
				this.active = null
				this.resetStart()
				this.resetEnd()
			}
			else {
				this.active = timeline
			}
		},
		timelineSubs(timeline) {
			return this.subs.filter(sub => {
				return sub.timeline == timeline.id
			})
		},
		formatTime(time) {
            let t = Math.floor(time)
            return (t-(t%=60))/60+(9<t?'\'':'\'0')+t
		},
		updateValues() {
	        for(let fieldname in this.pageValues) {
	        	if(!Object.values(this.storage).includes(fieldname)) continue

	            let value = this.pageValues[fieldname]
	            this.setValue(fieldname, value)
	        }
		},
		setValue(fieldname, value) {
	        try {
		        for (let datapoint in this.storage) {
		            if (this.storage[datapoint] === fieldname) {
			            switch(datapoint) {
			                case 'src':
			                	this.loaded = false
			                    if (Array.isArray(value)) {
			                    	if(value.length) {
			                    		this.src = {
			                    			id: value[0].id,
			                    			url: value[0].url,
			                    			type: value[0].type
			                    		}
			                    	}
			                    	else {
			                    		this.src = {
			                    			id: '',
			                    			url: '',
			                    			type: ''
			                    		}
			                    	}
			                    }
			                    else {
		                    		this.src = {
		                    			id: '',
		                    			url: '',
		                    			type: ''
		                    		}
			                    }
			                	break
			                case 'subs':
			                	if(!Array.isArray(value)) {
			                    	console.warn('could not adapt field to markers datapoint, not an array: ', value)
			                    	break
			                    }
				                this.subs = value
			                	break
			                default:
			                	this[datapoint] = value
			                    break
			            }
		            }
		        }
		        if(this.src.type && !this.loaded) {
		        	this.$nextTick(() => {
						this.init()
					})
		        }
	        }
	        catch(e) {
	        	console.warn(e)
	        }
	    },
	    updateStructure() {
	    	if(this.storage.subs) {
		        this.$store.dispatch("content/update", [this.storage.subs, this.subs, this.id])
		    }
	    },
	    isObject(obj) {
		    return obj === Object(obj);
		},
		label(timeline) {
			return this.isObject(timeline.label) ? timeline.label[this.lang] : timeline.label
		}
	},
}
</script>

<style lang="scss">
	@import '../assets/css/styles.scss'
</style>
