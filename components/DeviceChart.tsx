"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Props = {
  data: {
    device: string;
    clicks: number;
  }[];
};

export default function DeviceChart({ data }: Props) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="device" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="clicks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}