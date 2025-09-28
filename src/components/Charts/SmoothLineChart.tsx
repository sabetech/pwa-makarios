import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

const data = [
  { value: 20 },
  { value: 40 },
  { value: 30 },
  { value: 50 },
  { value: 35 },
  { value: 70 },
];

interface Props {
  lineColor?: string;
  data?: { value: number }[];
}

const SmoothLineChart: React.FC<Props> = ({ lineColor = "#2563eb", data }) => {
  return (
    <div style={{ width: "100%", height: 150 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          {/* Gradient background */}
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={lineColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Smooth line */}
          <Area
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={4}
            fill="url(#colorGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SmoothLineChart;
