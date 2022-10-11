<template>
    <div id="container" ref="containerRef" v-element-size="onResize">
        <svg id="svg" ref="svgRef">
            <g id="chart" ref="chartRef">
                <g id="xAxis" ref="xAxisRef"></g>
                <g id="yAxis" ref="yAxisRef"></g>
                <line
                    id="yReferenceLine"
                    style="
                        stroke: rgb(51, 51, 51);
                        stroke-width: 2;
                        stroke-dasharray: 8, 2;
                    "
                />
                <text id="yReferenceLineLabel" class="font--body" />
            </g>
        </svg>
        <div id="tooltip" style="position: absolute; visibility: hidden"></div>
    </div>
</template>

<script setup>
// IMPORTS
import { ref, onMounted, watch } from "vue";
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
    measures2: {
        type: Array,
        default: [],
    },
    xReferenceLine: {
        type: Object,
        default: {},
    },
    yReferenceLine: {
        type: Object,
        default: {},
    },
});

// Run d3 update whenever props change
watch(props, onUpdate, { deep: true });

// FORMATTER
const formatter = useFormatter().currencyFormatter;

// D3 INIT
const containerRef = ref(null);
const svgRef = ref(null);
const chartRef = ref(null);
let d3SVG,
    d3State1 = {},
    d3State2 = {},
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
    keys,
    color,
    x,
    y,
    stackedData,
    stackedData2,
    dotsData;

const margin = { top: 32, right: 16, bottom: 16, left: 64 };
const transition = {
    delay: 0,
    duration: 250,
    ease: d3.easeQuad,
};

function onResize({ width: containerWidth, height: containerHeight }) {
    console.log("RESIZE");

    const height = containerWidth * 0.8;
    const width = containerWidth;

    const chartWidth = width - margin.left - margin.right,
        chartHeight = height - margin.top - margin.bottom;

    d3SVG
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", chartHeight + margin.top + margin.bottom);

    d3Chart.attr("transform", `translate(${margin.left}, ${margin.top})`);

    // AXES
    x.range([0, chartWidth]);
    d3xAxis.attr("transform", `translate(0, ${chartHeight})`).call(
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

    resizeStack(d3State1);

    // // DRAW
    // const area = d3
    //     .area()
    //     .x((d) => x(d.data.year))
    //     .y0((d) => y(d[0]))
    //     .y1((d) => y(d[1]));

    // d3Fills
    //     .transition()
    //     .delay(transition.delay)
    //     .duration(transition.duration)
    //     .ease(transition.ease)
    //     .attr("d", area);

    // // DRAW LINES
    // const line = d3
    //     .line()
    //     .x((d) => x(d.data.year))
    //     .y((d) => y(d[1]));

    // d3Lines
    //     .transition()
    //     .delay(transition.delay)
    //     .duration(transition.duration)
    //     .ease(transition.ease)
    //     .attr("d", line);

    // // DRAW DOTS
    // // console.log("Dots enter", d3Dots.enter());
    // // console.log("Dots exit", d3Dots.exit());
    // d3Dots
    //     .transition()
    //     .delay(transition.delay)
    //     .duration(transition.duration)
    //     .ease(transition.ease)
    //     .attr("r", 4)
    //     .attr("cx", (d) => x(d.year))
    //     .attr("cy", (d) => y(d.y));

    // d3TooltipDots
    //     .attr("r", 6)
    //     .attr("cx", (d) => x(d.year))
    //     .attr("cy", (d) => y(d.y));

    // REFERNCE LINE

    d3yReferenceLine
        .transition()
        .delay(transition.delay)
        .duration(transition.duration)
        .ease(transition.ease)
        .attr("x1", 0)
        .attr("y1", y(props.yReferenceLine.value))
        .attr("x2", x(d3.max(props.data, (d) => parseInt(d.year))))
        .attr("y2", y(props.yReferenceLine.value));

    d3yReferenceLineLabel
        .transition()
        .delay(transition.delay)
        .duration(transition.duration)
        .ease(transition.ease)
        .attr("x", 12)
        .attr("y", y(props.yReferenceLine.value) - 8);
}

function onUpdate() {
    console.log("D3 UPDATE");

    // DIMENSIONS
    // keys = Object.keys(KEYS);
    d3State1.keys = props.measures.map((item) => item.accessor);
    d3State1.colors = props.measures.map((item) => item.color);
    d3State1.color = d3.scaleOrdinal().domain(d3State1.keys).range(d3State1.colors);

    // DATA 1
    d3State1.chartData = props.data.slice(1, props.data.length).map((d) => {
        const newData = {
            year: d.year,
        };
        props.measures.forEach((measure) => {
            newData[measure.accessor] = d[measure.accessor] * measure.sign;
        });
        return newData;
    });

    stackedData = d3.stack().keys(d3State1.keys)(d3State1.chartData);

    // if (props.measures2) {
    //     // DATA 2
    //     const chartData2 = props.data.slice(1, props.data.length).map((d) => {
    //         const newData = {
    //             year: d.year,
    //         };
    //         props.measures2.forEach((measure) => {
    //             newData[measure.accessor] = d[measure.accessor] * measure.sign;
    //         });
    //         return newData;
    //     });
    //     stackedData2 = d3.stack().keys(keys)(chartData2);
    //     updateStack(d3Charts2, stackedData2, "negative");
    // }

    // AXES
    x = d3
        .scaleLinear()
        .domain([1, d3.max(props.data, (d) => parseInt(d.year))]);

    y = d3.scaleLinear().domain([
        Math.min(
            d3.min(stackedData[stackedData.length - 1], (d, i) => d[1]),
            -1000000,
            // d3.min(stackedData2[stackedData2.length - 1], (d, i) => d[1]),
            0
        ),
        Math.max(
            d3.max(stackedData[stackedData.length - 1], (d, i) => d[1])
            // d3.max(stackedData2[stackedData2.length - 1], (d, i) => d[1])
        ),
    ]);

    updateStack(d3State1, stackedData, "positive");

    // REFERENCE LINE
    d3yReferenceLineLabel.text(
        `Target: ${formatter(props.yReferenceLine.value)}`
    );

    //////////
    // LEGEND //
    //////////

    const legendLineWidth = 40;
    const legendLineHeight = 2;
    const legendCircleRadius = 5;
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
            (d, i) =>
                legendGap +
                i * (legendCircleRadius * 2 + legendGap) +
                legendyOffset
        )
        .attr("r", legendCircleRadius)
        .style("fill", (d) => color(d));

    // Add one dot in the legend for each name.
    d3Chart
        .selectAll(".legend-text")
        .data(keys)
        .join("text")
        .attr("class", "legend-text font--body")
        .attr("x", legendxOffset + legendLineWidth + 8)
        .attr(
            "y",
            (d, i) =>
                legendGap +
                i * (legendCircleRadius * 2 + legendGap) +
                legendyOffset
        )
        .style("fill", (d) => color(d))
        .text((d, i) => props.measures[i].label)
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

    const { width, height } = useElementSize(containerRef);
    onResize({ height: height._value, width: width._value });
}

function updateStack(state, stack, stackName) {
    // FILLS
    state.d3Fills = d3Chart
        .selectAll(`.${stackName}-fill`)
        .data(stack)
        .join("path")
        .attr("class", (d) => `${stackName}-fill`)
        .style("fill", (d) => color(d.key))
        .attr("fill-opacity", 0.3);

    // LINES
    state.d3Lines = d3Chart
        .selectAll(`.${stackName}-line`)
        .data(stack)
        .join("path")
        .attr("class", `${stackName}-line`)
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .style("stroke", (d) => color(d.key));
    // .merge(d3Lines);

    // DOTS
    state.dotsData = [];
    stack.forEach((layer, i) => {
        const key = keys[i];
        layer.forEach((d, j) => {
            // if (j === 0) return;
            state.dotsData.push({
                key,
                year: d.data.year,
                y0: d[0],
                y: d[1],
                value: d[1],
            });
        });
    });

    console.log("dots", state.dotsData);

    state.d3Dots = d3Chart.selectAll(`.${stackName}-dot`).data(state.dotsData);
    state.d3Dots.exit().remove();

    state.d3Dots = state.d3Dots
        .enter()
        .append("circle")
        .attr("class", `${stackName}-dot`)
        .merge(state.d3Dots)
        .style("fill", (d) => color(d.key));

    state.d3TooltipDots = d3Chart
        .selectAll(".tooltip-dot")
        .data(state.dotsData);

    // TOOLTIP DOTS
    state.d3TooltipDots.exit().remove();
    state.d3TooltipDots = state.d3TooltipDots
        .enter()
        .append("circle")
        .attr("class", "tooltip-dot")
        .style("opacity", 0)
        .on("mouseenter", (event) =>
            d3Tooltip
                .html(
                    "<p>Year: 2022</p>Total Income: 1000000<br/>Total Income: 1000000"
                )
                .style("visibility", "visible")
                .style("left", event.pageX + "px")
                .style("top", event.pageY - 64 + "px")
        )
        .on("mouseout", () => state.d3Tooltip.style("visibility", "hidden"))
        .merge(state.d3TooltipDots);
}

function resizeStack(state) {
    // DRAW
    const area = d3
        .area()
        .x((d) => x(d.data.year))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]));

    state.d3Fills
        .transition()
        .delay(transition.delay)
        .duration(transition.duration)
        .ease(transition.ease)
        .attr("d", area);

    // DRAW LINES
    const line = d3
        .line()
        .x((d) => x(d.data.year))
        .y((d) => y(d[1]));

    state.d3Lines
        .transition()
        .delay(transition.delay)
        .duration(transition.duration)
        .ease(transition.ease)
        .attr("d", line);

    // DRAW DOTS
    state.d3Dots
        .transition()
        .delay(transition.delay)
        .duration(transition.duration)
        .ease(transition.ease)
        .attr("r", 4)
        .attr("cx", (d) => x(d.year))
        .attr("cy", (d) => y(d.y));

    state.d3TooltipDots
        .attr("r", 6)
        .attr("cx", (d) => x(d.year))
        .attr("cy", (d) => y(d.y));
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
</script>

<style lang="scss">
#container {
    width: 100%;
}
</style>
