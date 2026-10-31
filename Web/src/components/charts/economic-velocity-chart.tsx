"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", hasilBumi: 18400000, jastip: 6200000, miniJob: 8500000 },
  { month: "Feb", hasilBumi: 21500000, jastip: 7800000, miniJob: 9800000 },
  { month: "Mar", hasilBumi: 24200000, jastip: 8900000, miniJob: 11200000 },
  { month: "Apr", hasilBumi: 28900000, jastip: 10400000, miniJob: 13500000 },
  { month: "Mei", hasilBumi: 32600000, jastip: 12100000, miniJob: 14800000 },
  { month: "Jun", hasilBumi: 38500000, jastip: 14600000, miniJob: 17200000 },
];

const chartConfig = {
  hasilBumi: {
    label: "Hasil Bumi (Rp)",
    color: "var(--color-chart-1)",
  },
  jastip: {
    label: "Nebeng-Jastip (Rp)",
    color: "var(--color-chart-2)",
  },
  miniJob: {
    label: "Upah Mini-Job (Rp)",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

export function EconomicVelocityChart({ title = "Sirkulasi Ekonomi Pekon", description = "Tren perputaran nilai ekonomi 3 pilar semester terakhir" }: { title?: string; description?: string }) {
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs shadow-sm">
      <CardHeader className="flex flex-col gap-1 pb-4">
        <CardTitle className="text-base font-semibold text-foreground flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
            Total Rp 70.300.000 (Jun)
          </span>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-4 sm:pt-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
          <AreaChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillHasilBumi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillJastip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillMiniJob" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}Jt`}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(Number(value))
                  }
                />
              }
            />
            <Area
              dataKey="hasilBumi"
              type="monotone"
              fill="url(#fillHasilBumi)"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="jastip"
              type="monotone"
              fill="url(#fillJastip)"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="miniJob"
              type="monotone"
              fill="url(#fillMiniJob)"
              stroke="var(--color-chart-3)"
              strokeWidth={2}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
