<template>
    <div id="container" ref="containerRef" v-element-size="onResize">
        <svg id="svg" ref="svgRef">
            <g id="chart" ref="chartRef">
                <g id="xAxis" ref="xAxisRef"></g>
                <g id="yAxis" ref="yAxisRef"></g>
                <line id="yReferenceLine" />
                <text id="yReferenceLineLabel" />
            </g>
        </svg>
        <div id="tooltip" ref="tooltipRef" style="position: absolute; visibility: hidden"></div>
    </div>
</template>

<script setup>
// IMPORTS
import { ref, onMounted, watch, inject } from "vue";
import * as d3 from "d3";
import { useElementSize } from "@vueuse/core";
import { vElementSize } from "@vueuse/components";
import { useFormatter } from "../../../use/useFormatter";

//PROPS
const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
    measures: {
        type: Array,
        required: true,
    },
    yReferenceLine: {
        type: Object,
        default: {},
    },
    showYReferenceLine: {
        type: Boolean,
        default: true,
    },
    excludeYearZero: {
        type: Boolean,
        default: false,
    },
});

// Run d3 update whenever props change
watch(props, onUpdate, { deep: true });

// BREAKPOINTS
const breakpoints = inject("breakpoints");

// FORMATTER
const formatter = useFormatter().currencyFormatter;

// D3 INIT
const containerRef = ref(null);
const svgRef = ref(null);
const chartRef = ref(null);
const tooltipRef = ref(null);

let d3SVG,
    d3Chart,
    d3xAxis,
    d3yAxis,
    d3Lines,
    d3Dots,
    d3Fills,
    d3yReferenceLine,
    d3yReferenceLineLabel,
    d3TooltipDots,
    d3Tooltip,
    margin,
    keys,
    color,
    x,
    y,
    yMax,
    yMin,
    chartData,
    stackedData,
    dotsData,
    dotRadius;

const transition = {
    delay: 0,
    duration: 250,
    ease: d3.easeQuad,
};

function onResize({ width: containerWidth, height: containerHeight }) {
    // console.log("RESIZE");

    const height = containerWidth * 0.6;
    const width = containerWidth;

    const chartWidth = width - margin.left - margin.right,
        chartHeight = height - margin.top - margin.bottom;

    d3SVG
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom);

    d3Chart.attr("transform", `translate(${margin.left}, ${margin.top})`);

    // AXES
    x.range([0, chartWidth]);
    d3xAxis.attr("transform", `translate(0, ${y(0)})`).call(
        d3
            .axisBottom(x)
            .ticks(8)
            .tickFormat((v) => v)
    );

    y.range([chartHeight, 0]);
    d3yAxis.call(
        d3
            .axisLeft(y)
            .ticks(5)
            .tickFormat((d) => formatter(d))
    );
    d3.selectAll(".tick").attr("class", "tick font--subtitle");

    // DRAW
    resizeFills();
    resizeLines();
    resizeDots();
    resizeTooltipDots();
    resizeyReferenceLine();
}

// REFERNCE LINE

function onUpdate() {
    // console.log("D3 UPDATE");

    // KEYS
    keys = props.measures.map((item) => item.accessor);
    const colors = props.measures.map((item) => item.color);
    color = d3.scaleOrdinal().domain(keys).range(colors);

    // separate keys for each stack
    const stackGroupKeys = {};
    props.measures.forEach(({ stack, accessor }) => {
        stackGroupKeys[stack] = stackGroupKeys[stack]
            ? [...stackGroupKeys[stack], accessor]
            : [accessor];
    });

    // DATA

    // Create chart data with included columns + adjust sign
    chartData = props.data.slice(props.excludeYearZero ? 1 : 0, props.data.length);
    chartData = chartData.map((d) => {
        const newData = {
            year: d.year,
        };
        props.measures.forEach((measure) => {
            newData[measure.accessor] = d[measure.accessor] * measure.sign;
        });
        return newData;
    });

    const stackGroups = Object.keys(stackGroupKeys);

    // Create data - combine each stack group
    stackedData = [];

    stackGroups.forEach(
        (group) =>
            (stackedData = [
                ...stackedData,
                ...d3.stack().keys(stackGroupKeys[group])(chartData),
            ])
    );

    // Create data used for dots
    dotsData = [];
    stackedData.forEach((layer, i) => {
        const key = keys[i];
        layer.forEach((d, j) => {
            // if (j === 0) return;
            dotsData.push({
                key,
                year: d.data.year,
                y0: d[0],
                y: d[1],
                value: d[1],
            });
        });
    });

    // AXES
    yMin =
        Math.min(
            0,
            d3.min(stackedData, (arr) => d3.min(arr, (d, i) => d[1]))
        ) * 1.2;
    yMax =
        Math.max(
            0,
            d3.max(stackedData, (arr) => d3.max(arr, (d, i) => d[1]))
        ) * 1;

    x = d3
        .scaleLinear()
        .domain([
            d3.min(chartData, (d) => parseInt(d.year)),
            d3.max(chartData, (d) => parseInt(d.year)),
        ]);

    y = d3.scaleLinear().domain([yMin, yMax]);

    // MARGIN
    // Base margin on maximum tick width
    const max_width_value = Math.max(yMax, Math.abs(yMin));
    const temp_text = d3SVG
        .append("text")
        .attr("class", "tick")
        .text(formatter(max_width_value));
    const max_tick_width = temp_text.node().getBoundingClientRect().width;
    temp_text.remove();

    margin = {
        top: 32,
        right: (breakpoints.tablet.value ? max_tick_width : 0) + 8,
        bottom: 32,
        left: max_tick_width + 8,
    };

    // ELEMENTS
    updateFills();
    updateLines();
    updateDots();
    updateTooltipDots();
    updateyReferenceLine();
    updateLegend();

    // Trigger resize
    const { width, height } = useElementSize(containerRef);
    onResize({ height: height._value, width: width._value });
}

onMounted(() => {
    d3SVG = d3.select("#svg");
    d3Chart = d3.select("#chart");
    d3xAxis = d3.select("#xAxis");
    d3yAxis = d3.select("#yAxis");
    d3yReferenceLine = d3.select("#yReferenceLine");
    d3yReferenceLineLabel = d3.select("#yReferenceLineLabel");
    d3Tooltip = d3.select("#tooltip");

    onUpdate();
});

// FILLS
function updateFills() {
    d3Fills = d3Chart
        .selectAll(".my-fill")
        .data(stackedData)
        .join("path")
        .attr("class", (d) => "my-fill")
        .style("fill", (d) => color(d.key))
        .attr("fill-opacity", 0.3);
}

function resizeFills() {
    const area = d3
        .area()
        .x((d) => x(d.data.year))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]));

    d3Fills
        .transition()
        .delay(transition.delay)
        .duration(transition.duration)
        .ease(transition.ease)
        .attr("d", area);
}

// LINES
function updateLines() {
    d3Lines = d3Chart
        .selectAll(".my-line")
        .data(stackedData)
        .join("path")
        .attr("class", "my-line")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .style("stroke", (d) => color(d.key));
}

function resizeLines() {
    // DRAW LINES
    const line = d3
        .line()
        .x((d) => x(d.data.year))
        .y((d) => y(d[1]));

    d3Lines
        .transition()
        .delay(transition.delay)
        .duration(transition.duration)
        .ease(transition.ease)
        .attr("d", line);
}

// DOTS
function updateDots() {
    d3Dots = d3Chart.selectAll(".path-dot").data(dotsData);
    d3Dots.exit().remove();

    d3Dots = d3Dots
        .enter()
        .append("circle")
        .attr("class", "path-dot")
        .merge(d3Dots)
        .style("fill", (d) => color(d.key));

    d3Dots.filter((d) => d.y == 0 && d.y0 == 0).remove();
}

function resizeDots() {
    let widthPerDot = 3;
    if (chartRef.value) {
        widthPerDot = chartRef.value.getBoundingClientRect().width / chartData.length;
    }
    dotRadius = Math.min(5, Math.round((widthPerDot / 2 / 1.75) * 10) / 10);

    d3Dots
        .transition()
        .delay(transition.delay)
        .duration(transition.duration)
        .ease(transition.ease)
        .attr("r", dotRadius)
        .attr("cx", (d) => x(d.year))
        .attr("cy", (d) => y(d.y));
}

// TOOLTIP DOTS
function updateTooltipDots() {
    d3TooltipDots = d3Chart.selectAll(".tooltip-dot").data(dotsData);

    function createTooltipHtml(d) {
        let measureHTML = "";
        props.measures.forEach((meas) => {
            measureHTML += `
            <div class="d3tooltip-row">
                <span>${meas.label}:</span>
                <span>${formatter(props.data[d.year][meas.accessor])}</span>
            </div>`;
        });
        return `
                <div class="d3tooltip-row">
                    <span>Year:</span>
                    <span>${d.year}</span>
                </div>
                ${measureHTML}
        `;
    }

    d3TooltipDots.exit().remove();
    d3TooltipDots = d3TooltipDots
        .enter()
        .append("circle")
        .attr("class", "tooltip-dot")
        .style("opacity", 0)
        .on("mouseenter", function (event, d) {
            d3Tooltip
                .html(createTooltipHtml(d))
                .style("visibility", "visible")
                .style(
                    "left",
                    x(d.year) +
                        margin.left -
                        (d.year <= chartData.length / 2
                            ? 0
                            : tooltipRef.value.getBoundingClientRect().width) +
                        "px"
                )
                .style(
                    "top",
                    y(d.y) + margin.top - tooltipRef.value.getBoundingClientRect().height + "px"
                );
        })
        .on("mouseout", () => d3Tooltip.style("visibility", "hidden"))
        .merge(d3TooltipDots);
}

function resizeTooltipDots() {
    d3TooltipDots
        .attr("r", dotRadius + 2)
        .attr("cx", (d) => x(d.year))
        .attr("cy", (d) => y(d.y));
}

// REFERENCE LINE
function updateyReferenceLine() {
    d3yReferenceLineLabel.text(`Target: ${formatter(props.yReferenceLine.value)}`);
}
function resizeyReferenceLine() {
    d3yReferenceLine
        .style("visibility", "visible")
        .transition()
        .delay(transition.delay)
        .duration(transition.duration)
        .ease(transition.ease)
        .attr("x1", 0)
        .attr("y1", y(props.yReferenceLine.value))
        .attr("x2", x(d3.max(props.data, (d) => parseInt(d.year))))
        .attr("y2", y(props.yReferenceLine.value));

    d3yReferenceLineLabel
        .style("visibility", "visible")
        .transition()
        .delay(transition.delay)
        .duration(transition.duration)
        .ease(transition.ease)
        .attr("x", 12)
        .attr("y", y(props.yReferenceLine.value) - 8);

    if (!props.showYReferenceLine) {
        d3yReferenceLine.style("visibility", "hidden");
        d3yReferenceLineLabel.style("visibility", "hidden");
    }
}

//LEGEND
function updateLegend() {
    const legendLineWidth = 40;
    const legendLineHeight = 4;
    const legendCircleRadius = 6;
    const legendGap = 12;
    const legendxOffset = 16;
    const legendyOffset = -32;

    d3Chart
        .selectAll(".legend-rect")
        .data(keys)
        .join("rect")
        .attr("class", "legend-rect")
        .attr("x", legendxOffset)
        .attr(
            "y",
            (d, i) =>
                legendGap +
                i * (legendCircleRadius * 2 + legendGap) -
                legendLineHeight / 2 +
                legendyOffset
        )
        .attr("width", legendLineWidth)
        .attr("height", legendLineHeight)
        .style("fill", (d) => color(d));

    d3Chart
        .selectAll(".legend-circle")
        .data(keys)
        .join("circle")
        .attr("class", "legend-circle")
        .attr("cx", legendxOffset + legendLineWidth / 2)
        .attr(
            "cy",
            (d, i) => legendGap + i * (legendCircleRadius * 2 + legendGap) + legendyOffset
        )
        .attr("r", legendCircleRadius)
        .style("fill", (d) => color(d));

    // Add one dot in the legend for each name.
    d3Chart
        .selectAll(".legend-text")
        .data(keys)
        .join("text")
        .attr("class", "legend-text")
        .attr("x", legendxOffset + legendLineWidth + 8)
        .attr(
            "y",
            (d, i) => legendGap + i * (legendCircleRadius * 2 + legendGap) + legendyOffset
        )
        .style("fill", (d) => color(d))
        .text((d, i) => props.measures[i].label)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
}
</script>

<style lang="scss">
#container {
    width: 100%;
    position: relative;

    .active {
        transform: scale(1.5);
    }

    .tick {
        font-size: $fontSizeXS;
    }

    .legend-text {
        font-size: $fontSizeXS;
    }
}

#yReferenceLine {
    stroke: rgb(51, 51, 51);
    stroke-width: 1;
    stroke-dasharray: 8, 2;
}

#yReferenceLineLabel {
    font-size: $fontSizeXS;
}

#tooltip {
    white-space: nowrap;
    padding: $spacingXS $spacingXS;
    border-radius: 0.25rem;
    position: absolute;
    background: rgba(67, 67, 67, 0.92);
    color: #fff;
    pointer-events: none;

    .d3tooltip-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        font-size: $fontSizeS;
    }
}

@media (min-width: $breakpointTablet) {
    #container {
        .tick {
            font-size: $fontSizeDesktopS;
        }

        .legend-text {
            font-size: $fontSizeDesktopS;
        }
    }

    #yReferenceLine {
        stroke-width: w;
    }

    #yReferenceLineLabel {
        font-size: $fontSizeDesktopS;
    }
    #tooltip {
        line-height: 120%;
    }
}

@media (min-width: $breakpointDesktop) {
    #container {
        .tick {
            font-size: $fontSizeDesktopM;
        }

        .legend-text {
            font-size: $fontSizeDesktopM;
        }
    }

    #yReferenceLine {
        stroke-width: w;
    }

    #yReferenceLineLabel {
        font-size: $fontSizeDesktopM;
    }
    #tooltip {
        line-height: 120%;
    }
}
</style>
