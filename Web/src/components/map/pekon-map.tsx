"use client";

import dynamic from "next/dynamic";
import React from "react";

const PekonMapClient = dynamic(() => import("./pekon-map-client"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full rounded-xl bg-muted/40 animate-pulse flex items-center justify-center text-xs text-muted-foreground border border-border/60">
      Menginisialisasi Peta Geospasial Kabupaten Pringsewu...
    </div>
  ),
});

export function PekonMap(props: React.ComponentProps<typeof PekonMapClient>) {
  return <PekonMapClient {...props} />;
}
