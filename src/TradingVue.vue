<template>
  <!-- Main component  -->
  <div :id="id" class="trading-vue" 
    :style="{
      color: this.chart_props.colors.text,
      font: this.font_comp,
      width: this.width + 'px',
      height: this.height + 'px',
    }" 
    @mousedown="mousedown" 
    @mouseleave="mouseleave"
  >
    <toolbar 
      v-if="toolbar" 
      ref="toolbar" 
      v-bind="chart_props" 
      :config="chart_config" 
      @custom-event="custom_event"
    >
    </toolbar>
    
    <title-legend-chart
      ref="legend"
      :values="section_values"
      :decimalPlace="decimalPlace"
      :legendDecimal="legendDecimal"
      :grid_id="0"
      :common="main_section_legend_props"
      :meta_props="layer_meta_values"
      v-if="showTitleChartLegend"
    >
    </title-legend-chart>

    <widgets 
      v-if="controllers.length" 
      ref="widgets" 
      :map="ws" 
      :width="width" 
      :height="height" 
      :tv="this" 
      :dc="data"
    >
    </widgets>

    <chart 
      :enableZoom="enableZoom" 
      :showTitleChartLegend="showTitleChartLegend"        
      :isOverlayCollapsed="isOverlayCollapsed" 
      :collpaseButton="collpaseButton"      
      :enableSideBarBoxValue="enableSideBarBoxValue" 
      :applyShaders="applyShaders" 
      :priceLine="priceLine"      
      :decimalPlace="decimalPlace" 
      :legendDecimal="legendDecimal" 
      :enableCrosshair="enableCrosshair"      
      :ignoreNegativeIndex="ignoreNegativeIndex" 
      :ignore_OHLC="ignore_OHLC" 
      :key="reset" ref="chart"
      v-bind="chart_props" 
      :tv_id="id" 
      :config="chart_config" 
      @custom-event="custom_event"      
      @range-changed="range_changed" 
      @chart_data_changed="chart_data_changed" 
      @sidebar-transform="sidebar_transform"      
      @legend-button-click="legend_button" 
      @on-collapse-change="collapse_button"       
      @updateSection="updateSection" 
      @updateMeta="updateMeta" 
      @updateLayerMeta="updateLayerMeta" 
      @updateCursorMode="updateCursorMode" 
    >
    </chart>
    <transition name="tvjs-drift">
      <the-tip 
        v-if="tip" 
        :data="tip" 
        @remove-me="tip = null" 
      />
    </transition>
  </div>
</template>

<script>
import Chart from "./components/Chart.vue";
import TheTip from "./components/TheTip.vue";
import TitleLegendChart from './components/TitleLegend.vue';
import Toolbar from "./components/Toolbar.vue";
import Widgets from "./components/Widgets.vue";
import XControl from "./mixins/xcontrol.js";
import Const from "./stuff/constants.js";

export default {
  name: "TradingVue",
  components: {
    Chart,
    Toolbar,
    Widgets,
    TheTip,
    TitleLegendChart
  },
  mixins: [XControl],
  props: {
    titleTxt: {
      type: String,
      default: "TradingVue.js",
    },
    exchangeTxt: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "trading-vue-js",
    },
    width: {
      type: Number,
      default: 800,
    },
    height: {
      type: Number,
      default: 421,
    },
    colorTitle: {
      type: String,
      default: "#42b883",
    },
    colorBack: {
      type: String,
      default: "#121826",
    },
    colorGrid: {
      type: String,
      default: "#2f3240",
    },
    colorText: {
      type: String,
      default: "#dedddd",
    },
    colorTextHL: {
      type: String,
      default: "#fff",
    },
    colorScale: {
      type: String,
      default: "#838383",
    },
    colorCross: {
      type: String,
      default: "#8091a0",
    },
    colorCandleUp: {
      type: String,
      default: "#23a776",
    },
    colorCandleDw: {
      type: String,
      default: "#e54150",
    },
    colorWickUp: {
      type: String,
      default: "#23a77688",
    },
    colorWickDw: {
      type: String,
      default: "#e5415088",
    },
    colorWickSm: {
      type: String,
      default: "transparent", // deprecated
    },
    colorVolUp: {
      type: String,
      default: "#79999e42",
    },
    colorVolDw: {
      type: String,
      default: "#ef535042",
    },
    colorPanel: {
      type: String,
      default: "#565c68",
    },
    colorTbBack: {
      type: String,
    },
    colorTbBorder: {
      type: String,
      default: "#8282827d",
    },
    colors: {
      type: Object,
    },
    font: {
      type: String,
      default: Const.ChartConfig.FONT,
    },
    toolbar: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      required: true,
    },
    enableSideBarBoxValue: {
      type: Boolean,
      default: false,
    },
    // Your overlay classes here
    overlays: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // Overwrites ChartConfig values,
    // see constants.js
    chartConfig: {
      type: Object,
      default: function () {
        return {};
      },
    },
    legendButtons: {
      type: Array,
      default: function () {
        return [];
      },
    },
    legendDecimal: {
      type: Boolean,
      default: false
    },
    indexBased: {
      type: Boolean,
      default: false,
    },
    extensions: {
      type: Array,
      default: function () {
        return [];
      },
    },
    xSettings: {
      type: Object,
      default: function () {
        return {};
      },
    },
    skin: {
      type: String, // Skin Name
    },
    timezone: {
      type: Number,
      default: 0,
    },
    enableZoom: {
      type: Boolean,
      default: false,
    },
    priceLine: {
      type: Boolean,
      default: true,
    },
    decimalPlace: {
      type: Number,
      default: 2,
    },
    applyShaders: {
      type: Boolean,
      default: true,
    },
    enableCrosshair: {
      type: Boolean,
      default: false,
    },
    enableArrow: {
      type: Boolean,
      default: false,
    },
    ignoreNegativeIndex: {
      type: Boolean,
      default: false,
    },
    ignore_OHLC: {
      type: Array[Object],
      default: function () {
        return [];
      },
    },
    showSettingsButton: {
      type: Array[Object],
      default: function () {
        return [];
      },
    },
    showTitleChartLegend: {
      type: Boolean,
      default: false
    },
    isOverlayCollapsed: {
      type: Boolean,
      default: false
    },
    collpaseButton: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return { 
      reset: 0, 
      tip: null, 
      section_values: null, 
      meta_values: null, 
      layer_meta_values: null, 
      cursor_mode:null 
    };
  },
  computed: {
    // Copy a subset of TradingVue props
    chart_props() {
      let offset = this.$props.toolbar ? this.chart_config.TOOLBAR : 0;
      let chart_props = {
        title_txt: this.$props.titleTxt,
        exchange_txt: this.$props.exchangeTxt,
        overlays: this.$props.overlays.concat(this.mod_ovs),
        data: this.decubed,
        width: this.$props.width - offset,
        height: this.$props.height,
        font: this.font_comp,
        buttons: this.$props.legendButtons,
        toolbar: this.$props.toolbar,
        ib: this.$props.indexBased || this.index_based || false,
        colors: Object.assign({}, this.$props.colors || this.colorpack),
        skin: this.skin_proto,
        timezone: this.$props.timezone,
        showSettingsButton: this.$props.showSettingsButton,
      };

      this.parse_colors(chart_props.colors);
      return chart_props;
    },
    chart_config() {
      return Object.assign({}, Const.ChartConfig, this.$props.chartConfig);
    },
    decubed() {
      let data = this.$props.data;
      if (data.data !== undefined) {
        // DataCube detected
        data.init_tvjs(this);
        return data.data;
      } else {
        return data;
      }
    },
    index_based() {
      const base = this.$props.data;
      if (base.chart) {
        return base.chart.indexBased;
      } else if (base.data) {
        return base.data.chart.indexBased;
      }
      return false;
    },
    mod_ovs() {
      let arr = [];
      for (var x of this.$props.extensions) {
        arr.push(...Object.values(x.overlays));
      }
      return arr;
    },
    font_comp() {
      return this.skin_proto && this.skin_proto.font
        ? this.skin_proto.font
        : this.font;
    },
    auto_y_axis() {
      return this.$refs.chart?.auto_y_axis || true
    },


    main_section_legend_props() {
      const id = 0;
      let p = Object.assign({});
      p.colors = this.chart_props.colors
      p.title_txt = this.decubed.chart.name || this.$props.titleTxt
      p.exchange_txt = this.$props.exchangeTxt

      let res = [];
      let showLegendPropsData = [];
      let legendTxtConfig = localStorage.getItem('legendTxtConfig')
      let showLegendProps = localStorage.getItem('showLegendProps')
      if (this.ignore_OHLC && legendTxtConfig) {
        res = JSON.parse(legendTxtConfig)
      }
      if (showLegendProps) {
        showLegendPropsData = JSON.parse(showLegendProps)
        if (Array.isArray(showLegendPropsData) && showLegendPropsData.length > 0) {
          p.showLegendPropsData = showLegendPropsData
        }
      }

      let chartType = this.decubed.chart.type || 'Candles'
      let show_CustomProps = this.ignore_OHLC.includes(chartType)
      p.legendTxtConfig = res
      p.show_CustomProps = show_CustomProps
      p.chartType = chartType
      p.meta = this.meta_values
      p.cursor_mode = this.cursor_mode
      return p;
    },
  },
  beforeDestroy() {
    this.custom_event({ event: "before-destroy" });
    this.ctrl_destroy();
  },
  methods: {
    updateSection(value) {
      this.section_values = value;
    },
    updateMeta(value) {
      this.meta_values = value;
    },
    updateLayerMeta(value) {
      this.layer_meta_values = value;
    },
    updateCursorMode(value) {
      this.cursor_mode = value;
    },
    chart_data_changed(flag) {
      this.$emit("chart_data_changed", flag);
    },
    // TODO: reset extensions?
    resetChart(resetRange = true) {

      this.reset++;
      let range = this.getRange();
      if (!resetRange && range[0] && range[1]) {
        this.$nextTick(() => this.setRange(...range));
      }
      if (resetRange) {
        let initRange = this.$refs?.chart?.initRange
        if (initRange && initRange?.[0] && initRange?.[1]) {
          this.$nextTick(() => this.setRange(...initRange));
        }
      }
      this.$nextTick(() =>
        this.custom_event({
          event: "chart-reset",
          args: [],
        })
      );
    },
    updateChart() {
      //  console.log(" update chart was called")
      //       this.$nextTick(() =>
      //         this.custom_event({
      //           event: "?chart-resize",
      //           args:[]
      //         })
      //       );
    },
    goto(t) {
      // TODO: limit goto & setRange (out of data error)
      if (this.chart_props.ib) {
        const ti_map = this.$refs.chart.ti_map;
        t = ti_map.gt2i(t, this.$refs.chart.ohlcv);
      }
      this.$refs.chart.goto(t);
    },
    setRange(t1, t2) {
      if (this.chart_props.ib) {
        const ti_map = this.$refs.chart.ti_map;
        const ohlcv = this.$refs.chart.ohlcv;
        t1 = ti_map.gt2i(t1, ohlcv);
        t2 = ti_map.gt2i(t2, ohlcv);
        // console.log('this.ignoreNegativeIndex and t1',t1, t2,this.ignoreNegativeIndex)
        if (t1 < 0 && this.ignoreNegativeIndex) {
          t1 = 0
        }
      }
      this.$refs.chart.setRange(t1, t2);
    },
    getRange() {
      if (this.chart_props.ib) {
        const ti_map = this.$refs.chart.ti_map;
        // Time range => index range
        // console.log('this.$refs.chart',this.$refs.chart)
        return this.$refs.chart.range.map((x) => ti_map.i2t(x));
      }
      return this.$refs.chart.range;
    },
    getCursor() {
      let cursor = this.$refs.chart.cursor;
      if (this.chart_props.ib) {
        const ti_map = this.$refs.chart.ti_map;
        let copy = Object.assign({}, cursor);
        copy.i = copy.t;
        copy.t = ti_map.i2t(copy.t);
        return copy;
      }
      return cursor;
    },
    getTimeIndex(t) {
      // let cursor = this.$refs.chart.cursor;
      if (this.chart_props.ib) {
        const ti_map = this.$refs.chart.ti_map;
        // let copy = Object.assign({}, cursor);
        // copy.i = copy.t;
        // copy.t = ti_map.i2t(copy.t);
        return ti_map.t2i(t);
      }
      return null;
    },
    showTheTip(text, color = "orange") {
      this.tip = { text, color };
    },
    legend_button(event) {
      this.custom_event({
        event: "legend-button-click",
        args: [event],
      });
    },
    collapse_button(event) {
      this.custom_event({
        event: "on-collapse-change",
        args: [event],
      });
    },
    custom_event(d) {
      if ("args" in d) {
        this.$emit(d.event, ...d.args);
      } else {
        this.$emit(d.event);
      }
      let data = this.$props.data;
      let ctrl = this.controllers.length !== 0;
      if (ctrl) this.pre_dc(d);
      if (data.tv) {
        // If the data object is DataCube
        data.on_custom_event(d.event, d.args);
      }
      if (ctrl) this.post_dc(d);
    },
    range_changed(r, manualInteraction = false) {
      if (this.chart_props.ib) {
        const ti_map = this.$refs.chart.ti_map;
        r = r.map((x) => ti_map.i2t(x));
      }
      // update
      this.$emit("range-changed", r, manualInteraction);

      // this.custom_event({ event: "range-changed", args: [r,r2] });
      if (this.onrange) this.onrange(r);
    },
    sidebar_transform(y_transform) {
      this.$emit('sidebar-transform', y_transform)
    },
    set_loader(dc) {
      this.onrange = (r) => {
        let pf = this.chart_props.ib ? "_ms" : "";
        let tf = this.$refs.chart["interval" + pf];
        dc.range_changed(r, tf);
      };
    },
    parse_colors(colors) {
      for (var k in this.$props) {
        if (k.indexOf("color") === 0 && k !== "colors") {
          let k2 = k.replace("color", "");
          k2 = k2[0].toLowerCase() + k2.slice(1);
          if (colors[k2]) continue;
          colors[k2] = this.$props[k];
        }
      }
    },
    mousedown() {
      this.$refs.chart.activated = true;
    },
    mouseleave() {
      this.$refs.chart.activated = false;
    },
    toggleSideBarYAxis() {
      this.$refs.chart.toggleSideBarYAxis()
    },
    toggleSidebarCustomRange(verticalRange) {
      this.$refs.chart.toggleSidebarCustomRange(verticalRange)
    }
  },
  watch: {
    decimalPlace(n) {
      const base = this.$props.data;
      // console.log("props:",base);
      base.merge('chart.settings', { decimalPlace: n })
    },
    enableArrow(n) {
      const base = this.$props.data;
      // console.log("props:",base);
      base.merge('chart.settings', { isArrow: n })
    },
  },
  mounted() {
    const base = this.$props.data;
    // console.log("props:",this.$props.enableArrow);
    base.merge(
      'chart.settings', { isArrow: this.$props.enableArrow, decimalPlace: this.$props.decimalPlace, }
    )
  }
};
</script>
<style>
/* Anit-boostrap tactix */
.trading-vue *,
::after,
::before {
  box-sizing: content-box;
}

.trading-vue img {
  vertical-align: initial;
}
</style>
