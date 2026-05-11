import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import Svg, {
    Path,
    Defs,
    LinearGradient,
    Stop,
    Circle,
    Line,
    Text as SvgText,
} from "react-native-svg";

/* ---------------------------------------- */
/* TYPES                                    */
/* ---------------------------------------- */

interface AreaChartProps {
    labels: string[];        // X-axis labels e.g. ["Wk 1", "Wk 2", "Wk 3", "Wk 4"]
    values: number[];        // Y-axis values  e.g. [1200, 3400, 800, 4200]
    width: number;           // container width
    height?: number;         // chart height (default 200)
    color?: string;          // line + gradient color (default #8B5CF6)
    backgroundColor?: string; // card background for gradient fade
    labelColor?: string;     // x/y label color
}

/* ---------------------------------------- */
/* HELPERS                                  */
/* ---------------------------------------- */

/** Smooth cubic bezier path through points */
function buildSmoothPath(points: { x: number; y: number }[]): string {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpX = (p0.x + p1.x) / 2;
        path += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    return path;
}

function formatValue(v: number): string {
    if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return `${v}`;
}

/* ---------------------------------------- */
/* ANIMATED SVG PATH WRAPPER                */
/* ---------------------------------------- */
function AnimatedAreaChart({
    labels,
    values,
    width,
    height = 200,
    color = "#8B5CF6",
    backgroundColor = "#1C1C1E",
    labelColor = "#9CA3AF",
}: AreaChartProps) {
    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animValue.setValue(0);
        Animated.timing(animValue, {
            toValue: 1,
            duration: 900,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start();
    }, [values.join(",")]);

    /* ---------- layout constants ---------- */
    const paddingLeft = 30;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    /* ---------- safe values ---------- */
    const safeValues = values.map((v) => (isNaN(v) || v == null ? 0 : v));
    const maxVal = Math.max(...safeValues, 1);

    /* ---------- points ---------- */
    const points = safeValues.map((v, i) => ({
        x: paddingLeft + (i / Math.max(safeValues.length - 1, 1)) * chartW,
        y: paddingTop + chartH - (v / maxVal) * chartH,
    }));

    /* ---------- paths ---------- */
    const linePath = buildSmoothPath(points);

    // Area = line path + close to bottom-right → bottom-left
    const areaPath =
        linePath +
        ` L ${points[points.length - 1].x} ${paddingTop + chartH}` +
        ` L ${points[0].x} ${paddingTop + chartH}` +
        " Z";

    /* ---------- Y grid values ---------- */
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
        y: paddingTop + chartH - ratio * chartH,
        label: formatValue(Math.round(ratio * maxVal)),
    }));

    /* ---------- clip width (animated) ---------- */
    const clipWidth = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width],
    });

    return (
        <View style={{ width, height }}>
            {/* Animated clip overlay using absolute positioned View */}
            <Svg width={width} height={height}>
                <Defs>
                    {/* Gradient fill under the line */}
                    <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor={color} stopOpacity="0.35" />
                        <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </LinearGradient>

                    {/* Dot glow */}
                    <LinearGradient id="dotGlow" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0%" stopColor={color} stopOpacity="1" />
                        <Stop offset="100%" stopColor={color} stopOpacity="0.5" />
                    </LinearGradient>
                </Defs>

                {/* Y-axis grid lines + labels */}
                {yTicks.map((tick, i) => (
                    <React.Fragment key={i}>
                        <Line
                            x1={paddingLeft}
                            y1={tick.y}
                            x2={paddingLeft + chartW}
                            y2={tick.y}
                            stroke={labelColor}
                            strokeOpacity={0.12}
                            strokeWidth={1}
                            strokeDasharray="4 4"
                        />
                        <SvgText
                            x={paddingLeft - 8}
                            y={tick.y + 4}
                            fontSize={10}
                            fill={labelColor}
                            textAnchor="end"
                            fontWeight="500"
                        >
                            {tick.label}
                        </SvgText>
                    </React.Fragment>
                ))}

                {/* X-axis labels */}
                {points.map((pt, i) => (
                    <SvgText
                        key={i}
                        x={pt.x}
                        y={height - 10}
                        fontSize={11}
                        fill={labelColor}
                        textAnchor="middle"
                        fontWeight="500"
                    >
                        {labels[i] ?? ""}
                    </SvgText>
                ))}

                {/* Area fill */}
                <Path d={areaPath} fill="url(#areaGrad)" />

                {/* Line stroke */}
                <Path
                    d={linePath}
                    fill="none"
                    stroke={color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Dots */}
                {points.map((pt, i) => (
                    <React.Fragment key={i}>
                        {/* outer ring */}
                        <Circle
                            cx={pt.x}
                            cy={pt.y}
                            r={6}
                            fill={backgroundColor}
                            stroke={color}
                            strokeWidth={2}
                        />
                        {/* inner dot */}
                        <Circle cx={pt.x} cy={pt.y} r={3} fill={color} />
                    </React.Fragment>
                ))}
            </Svg>

            {/* Animated reveal mask — covers chart from right, slides away */}
            <Animated.View
                pointerEvents="none"
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: clipWidth.interpolate({
                        inputRange: [0, width],
                        outputRange: [width, 0],
                    }),
                    backgroundColor,
                }}
            />
        </View>
    );
}

export default AnimatedAreaChart;
