"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirmaProfili } from "@/lib/queries/satinalma";
import { firmaProfiliKaydet } from "@/lib/data/satinalma/ayarlar";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";

export function FirmaProfil() {
  const { t } = useDil();
  const qc = useQueryClient();
  const { data, isLoading } = useFirmaProfili();
  const [firmaAdi, setFirmaAdi] = React.useState("");
  const [gonderenAdi, setGonderenAdi] = React.useState("");
  const [departman, setDepartman] = React.useState("");
  const [telefon, setTelefon] = React.useState("");
  const [imza, setImza] = React.useState("");
  const [kaydediliyor, setKaydediliyor] = React.useState(false);

  React.useEffect(() => {
    if (!data) return;
    setFirmaAdi(data.firmaAdi); setGonderenAdi(data.gonderenAdi); setDepartman(data.departman);
    setTelefon(data.telefon); setImza(data.imza);
  }, [data]);

  async function kaydet() {
    if (kaydediliyor) return;
    setKaydediliyor(true);
    try {
      await firmaProfiliKaydet({ firmaAdi: firmaAdi.trim(), gonderenAdi: gonderenAdi.trim(), departman: departman.trim(), telefon: telefon.trim(), imza: imza.trim() });
      qc.invalidateQueries({ queryKey: queryKeys.satinalma.firmaProfili });
      toast.success(t("Firma profili kaydedildi"));
    } catch (e) {
      toast.error(t("Kaydedilemedi"), { description: e instanceof Error ? e.message : undefined });
    } finally {
      setKaydediliyor(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="font-heading text-base font-bold tracking-tight">{t("Firma Profili & Gönderen İmzası")}</h3>
        <p className="text-sm text-muted-foreground">{t("Teklif e-postalarında kullanılacak gönderen bilgileri ve imza. Boş bırakırsan imza otomatik üretilir.")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Firma Adı")}</Label><Input value={firmaAdi} onChange={(e) => setFirmaAdi(e.target.value)} placeholder="Egem Ambalaj" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Gönderen Adı")}</Label><Input value={gonderenAdi} onChange={(e) => setGonderenAdi(e.target.value)} placeholder="Fatih SAL" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Departman")}</Label><Input value={departman} onChange={(e) => setDepartman(e.target.value)} placeholder="Bakım Departmanı" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Telefon")}</Label><Input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="+90 ..." /></div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("Özel İmza (opsiyonel)")}</Label>
              <Textarea value={imza} onChange={(e) => setImza(e.target.value)} rows={4} placeholder={t("Boş bırakılırsa gönderen adı, departman ve firma adından otomatik oluşturulur.")} />
            </div>
            <div className="flex justify-end">
              <Button className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" disabled={kaydediliyor} onClick={kaydet}>
                <Icon icon={kaydediliyor ? "svg-spinners:180-ring" : "solar:diskette-bold-duotone"} className="size-4" />{t("Kaydet")}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
