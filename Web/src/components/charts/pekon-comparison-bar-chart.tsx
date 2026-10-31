"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

const pekonData = [
  { pekon: "Pagelaran", transaksi: 48.5, gradeACount: 18, stunting: 14 },
  { pekon: "Pringsewu Barat", transaksi: 64.2, gradeACount: 32, stunting: 8 },
  { pekon: "Gading Rejo", transaksi: 52.8, gradeACount: 24, stunting: 19 },
  { pekon: "Sukoharjo", transaksi: 39.4, gradeACount: 15, stunting: 11 },
  { pekon: "Ambarawa", transaksi: 31.0, gradeACount: 12, stunting: 6 },
];

const chartConfig = {
  transaksi: {
    label: "Total Transaksi (Juta Rp)",
    color: "var(--color-chart-1)",
  },
  gradeACount: {
    label: "Warga Grade A",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export function PekonComparisonBarChart({
  title = "Komparasi Kinerja Antar-Pekon",
  description = "Total transaksi sirkular dan penerima rekomendasi modal",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
          <BarChart data={pekonData} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              dataKey="pekon"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="transaksi" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gradeACount" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
