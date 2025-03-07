// Interactive canvas-based component with resizable height
import Utils from '../stuff/utils.js'

export default {
    data() {
        return {
            isResizing: false,
            startY: 0,
            startHeight: 0,
        };
    },
    methods: {
        setup() {
            const id = `${this.$props.tv_id}-${this._id}-canvas`
            const canvas = document.getElementById(id)
            let dpr = window.devicePixelRatio || 1
            canvas.style.width = `${this._attrs.width}px`
            canvas.style.height = `${this._attrs.height}px`
            if (dpr < 1) dpr = 1 // Realy ? That's it? Issue #63
            this.$nextTick(() => {
                var rect = canvas.getBoundingClientRect()
                canvas.width = rect.width * dpr
                canvas.height = rect.height * dpr
                const ctx = canvas.getContext('2d')
                ctx.scale(dpr, dpr)
                this.redraw()

                // Fix for Brave browser
                if (!ctx.measureTextOrg) {
                    ctx.measureTextOrg = ctx.measureText
                }
                ctx.measureText = text =>
                    Utils.measureText(ctx, text, this.$props.tv_id)
            })
        },
        create_canvas(h, id, props) {
            this._id = id
            this._attrs = props.attrs
            return h('div', {
                class: `trading-vue-canvas trading-vue-${id}`,
                style: {
                    left: props.position.x + 'px',
                    top: props.position.y + 'px',
                    position: 'absolute',
                    height: this._attrs.height + 'px',
                    width: this._attrs.width + 'px',
                    border: '1px solid black',
                    resize: 'vertical',
                    overflow: 'hidden',
                }
            }, [
                h('canvas', {
                    on: {
                        mousemove: e => this.renderer?.mousemove(e),
                        mouseout: e => this.renderer?.mouseout(e),
                        mouseup: e => this.renderer?.mouseup(e),
                        mousedown: e => this.renderer?.mousedown(e)
                    },
                    attrs: Object.assign({
                        id: `${this.$props.tv_id}-${id}-canvas`
                    }, props.attrs),
                    ref: 'canvas',
                    style: props.style,
                }),
                // Resizable Handle
                h('div', {
                    class: 'resize-handle',
                    on: {
                        mousedown: this.startResize
                    },
                    style: {
                        width: '100%',
                        height: '10px',
                        position: 'absolute',
                        bottom: '0',
                        background: 'gray',
                        cursor: 'ns-resize'
                    }
                })
            ].concat(props.hs || []))
        },
        startResize(event) {
            this.isResizing = true
            this.startY = event.clientY
            this.startHeight = this._attrs.height
            document.addEventListener("mousemove", this.resize)
            document.addEventListener("mouseup", this.stopResize)
        },
        resize(event) {
            if (this.isResizing) {
                let newHeight = this.startHeight + (event.clientY - this.startY)
                this._attrs.height = Math.max(newHeight, 50) // Minimum height
                this.setup() // Redraw the canvas
            }
        },
        stopResize() {
            this.isResizing = false
            document.removeEventListener("mousemove", this.resize)
            document.removeEventListener("mouseup", this.stopResize)
        },
        redraw() {
            if (!this.renderer) return
            this.renderer.update()
        }
    },
    watch: {
        width(val) {
            this._attrs.width = val
            this.setup()
        },
        height(val) {
            this._attrs.height = val
            this.setup()
        }
    }
}
