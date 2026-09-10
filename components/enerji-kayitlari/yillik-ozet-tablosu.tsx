"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkline } from "@/components/common/sparkline";
import { useYillikOzet } from "@/lib/queries/kayitlar";
import { useDil } from "@/components/providers/dil-provider";
import { sayi } from "@/lib/format";
import { cn } from "@/lib/utils";

const YILLAR = ["2023", "2024", "2025", "2026"];

function GrupBaslik({ children }: { children: React.ReactNode }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={6}
        className="bg-muted/40 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

export function YillikOzetTablosu() {
  const { data, isLoading } = useYillikOzet();
  const { t } = useDil();

  if (isLoading || !data) {
    return <Skeleton className="h-96 w-full" />;
  }

  const toplam = data.find((r) => r.vurgu);
  const barVeri = YILLAR.map((y) => ({ yil: y, tep: toplam?.degerler[y] ?? 0 }));
  const tuketim = data.filter((r) => r.grup === "tuketim");
  const tep = data.filter((r) => r.grup === "tep");

  const satir = (r: (typeof data)[number]) => (
    <TableRow
      key={r.kaynak}
      className={cn(
        r.vurgu && "bg-teal-50/70 font-semibold hover:bg-teal-50/70 dark:bg-teal-950/40",
      )}
    >
      <TableCell className={cn("whitespace-nowrap", r.vurgu ? "font-semibold" : "font-medium")}>
        {t(r.kaynak)}
        <span className="ml-1 text-[11px] font-normal text-muted-foreground">
          ({r.birim})
        </span>
      </TableCell>
      {YILLAR.map((y) => (
        <TableCell
          key={y}
          className={cn(
            "text-right tabular-nums",
            r.vurgu && "text-teal-700 dark:text-teal-300",
          )}
        >
          {sayi(r.degerler[y] ?? 0)}
        </TableCell>
      ))}
      <TableCell className="w-20">
        <Sparkline
          data={YILLAR.map((y) => r.degerler[y] ?? 0)}
          renk={r.vurgu ? "#0d9488" : "var(--primary)"}
          className="h-5 w-16"
        />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-5">
      {/* Yıllık Toplam Enerji (TEP) grafiği */}
      <div className="rounded-lg border p-4">
        <div className="mb-3 text-sm font-medium">{t("Yıllık Toplam Enerji (TEP)")}</div>
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barVeri} margin={{ left: 4, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="yil" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi(v)} />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                  color: "var(--popover-foreground)",
                }}
                formatter={(value) => [`${sayi(Number(value))} TEP`, t("Toplam")]}
              />
              <Bar dataKey="tep" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={64} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detay tablo */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("Enerji Kaynağı")}</TableHead>
              {YILLAR.map((y) => (
                <TableHead key={y} className="text-right tabular-nums">
                  {y}
                  {y === "2026" ? (
                    <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                      ({t("kısmi")})
                    </span>
                  ) : null}
                </TableHead>
              ))}
              <TableHead>{t("Trend")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <GrupBaslik>{t("Tüketim / Üretim (birim bazında)")}</GrupBaslik>
            {tuketim.map(satir)}
            <GrupBaslik>{t("Enerji (TEP)")}</GrupBaslik>
            {tep.map(satir)}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        {t("* 2026 değerleri kısmidir; yıl devam etmektedir.")}
      </p>
    </div>
  );
}
