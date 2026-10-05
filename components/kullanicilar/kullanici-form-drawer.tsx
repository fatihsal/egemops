"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import type { Kullanici, KullaniciRol } from "@/lib/types";

const ROLLER = [
  { deger: "admin", etiket: "Yönetici" },
  { deger: "enerji_yoneticisi", etiket: "Enerji Yöneticisi" },
  { deger: "izleyici", etiket: "İzleyici" },
];

// UI rolü (KullaniciRol) -> DB rolü
const DB_ROL: Record<KullaniciRol, string> = {
  yonetici: "admin",
  editor: "enerji_yoneticisi",
  goruntuleyici: "izleyici",
};

export function KullaniciFormDrawer({ kullanici, trigger }: { kullanici?: Kullanici; trigger: React.ReactElement }) {
  const { t } = useDil();
  const qc = useQueryClient();
  const [acik, setAcik] = React.useState(false);
  const [adSoyad, setAdSoyad] = React.useState("");
  const [kullaniciAdi, setKullaniciAdi] = React.useState("");
  const [rol, setRol] = React.useState("izleyici");
  const [yukleniyor, setYukleniyor] = React.useState(false);

  const sifirla = () => {
    setAdSoyad(kullanici?.ad ?? "");
    setKullaniciAdi(kullanici?.kullaniciAdi ?? "");
    setRol(kullanici ? DB_ROL[kullanici.rol] : "izleyici");
  };

  async function kaydet() {
    if (!kullanici || yukleniyor) return;
    setYukleniyor(true);
    try {
      const yanit = await fetch("/api/kullanici", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: kullanici.id, adSoyad, kullaniciAdi, rol }),
      });
      const metin = await yanit.text();
      const sonuc = metin ? JSON.parse(metin) : {};
      if (!yanit.ok) {
        toast.error(t("Güncelleme başarısız"), { description: sonuc?.hata ?? `HTTP ${yanit.status}` });
        return;
      }
      toast.success(`${adSoyad || kullaniciAdi} ${t("güncellendi")}`);
      qc.invalidateQueries({ queryKey: queryKeys.kullanicilar.analiz });
      setAcik(false);
    } catch (e) {
      toast.error(t("Güncelleme başarısız"), { description: e instanceof Error ? e.message : undefined });
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <Sheet open={acik} onOpenChange={(o) => { if (o) sifirla(); setAcik(o); }}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{t("Kullanıcıyı Düzenle")}</SheetTitle>
          <SheetDescription>{t("Ad soyad, kullanıcı adı ve rolü güncelleyin.")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="space-y-1.5">
            <Label htmlFor="ku-ad" className="text-xs text-muted-foreground">{t("Ad Soyad")}</Label>
            <Input id="ku-ad" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} placeholder={t("Örn. Ayşe Demir")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ku-kadi" className="text-xs text-muted-foreground">{t("Kullanıcı Adı")}</Label>
            <Input id="ku-kadi" value={kullaniciAdi} onChange={(e) => setKullaniciAdi(e.target.value)} placeholder="ayse.demir" autoComplete="off" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("Rol")}</Label>
            <Select value={rol} onValueChange={(v) => setRol(v as string)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{ROLLER.map((r) => <SelectItem key={r.deger} value={r.deger}>{t(r.etiket)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>{t("İptal")}</SheetClose>
          <Button className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700" disabled={yukleniyor} onClick={kaydet}>
            <Icon icon={yukleniyor ? "svg-spinners:180-ring" : "solar:diskette-bold-duotone"} className="size-4" />
            {t("Kaydet")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
