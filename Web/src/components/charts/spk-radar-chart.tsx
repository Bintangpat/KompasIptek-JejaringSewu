"use client";

import * as React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const radarData = [
  { pilar: "Jastip (w=0.20)", nilai: 88, bobot: 20 },
  { pilar: "Mini-Job (w=0.25)", nilai: 94, bobot: 25 },
  { pilar: "Hasil Bumi (w=0.20)", nilai: 82, bobot: 20 },
  { pilar: "Selfie PoW (w=0.20)", nilai: 96, bobot: 20 },
  { pilar: "Inklusi (w=0.15)", nilai: 90, bobot: 15 },
];

const chartConfig = {
  nilai: {
    label: "Skor Dimensi",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export function SpkRadarChart({
  data = radarData,
  title = "5 Pilar AHP-TOPSIS (S_kredit)",
  description = "Pemenuhan kriteria kelayakan modal tanpa agunan",
}: {
  data?: typeof radarData;
  title?: string;
  description?: string;
}) {
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xs shadow-sm">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px]"
        >
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid className="stroke-border/40" />
            <PolarAngleAxis
              dataKey="pilar"
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            />
            <Radar
              name="Skor"
              dataKey="nilai"
              stroke="var(--color-chart-1)"
              fill="var(--color-chart-1)"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
