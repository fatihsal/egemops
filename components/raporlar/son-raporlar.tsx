"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FORMAT_STIL } from "@/components/raporlar/stiller";
import { useRaporAnaliz } from "@/lib/queries/raporlar";
import { cn } from "@/lib/utils";

function FormatRozet({ format }: { format: string }) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {format.split(", ").map((f) => (
        <span key={f} className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-medium", FORMAT_STIL[f] ?? "bg-muted text-muted-foreground")}>{f}</span>
      ))}
    </span>
  );
}

export function SonRaporlar() {
  const { data, isLoading } = useRaporAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Son Oluşturulan Raporlar</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {isLoading || !data ? (
          <Skeleton className="h-[260px] w-full" />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Rapor Adı</TableHead>
                    <TableHead className="whitespace-nowrap">Tür</TableHead>
                    <TableHead className="whitespace-nowrap">Oluşturulma Tarihi</TableHead>
                    <TableHead className="whitespace-nowrap">Oluşturan</TableHead>
                    <TableHead className="whitespace-nowrap">Format</TableHead>
                    <TableHead className="text-right whitespace-nowrap">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.sonRaporlar.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{r.ad}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{r.tur}</TableCell>
                      <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{r.tarih}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{r.olusturan}</TableCell>
                      <TableCell><FormatRozet format={r.format} /></TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-0.5">
                          <Button variant="ghost" size="icon-sm" aria-label="Görüntüle" nativeButton={false} render={<Link href={`/raporlar/${r.id}`} />}>
                            <Icon icon="solar:eye-bold-duotone" className="size-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" aria-label="İndir" onClick={() => toast.success(`${r.ad} indiriliyor (${r.format})`)}>
                            <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4 text-muted-foreground" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Daha fazla" />}>
                              <MoreVertical className="size-4 text-muted-foreground" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem render={<Link href={`/raporlar/${r.id}`} />}>
                                <Icon icon="solar:eye-bold-duotone" className="size-4" />
                                Görüntüle
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success(`${r.ad} indiriliyor`)}>
                                <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4" />
                                İndir
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => toast(`${r.ad} paylaşıldı`)}>
                                <Icon icon="solar:share-bold-duotone" className="size-4" />
                                Paylaş
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Link
              href="#rapor-listesi"
              className="mt-auto inline-flex items-center gap-1 self-start text-sm font-medium text-primary transition-opacity hover:opacity-80"
            >
              Tümünü Görüntüle
              <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
