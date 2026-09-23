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

const ROLLER = [
  { deger: "admin", etiket: "Yönetici" },
  { deger: "enerji_yoneticisi", etiket: "Enerji Yöneticisi" },
  { deger: "izleyici", etiket: "İzleyici" },
];

export function KullaniciOlusturDrawer({ trigger }: { trigger: React.ReactElement }) {
  const { t } = useDil();
  const qc = useQueryClient();
  const [acik, setAcik] = React.useState(false);
  const [adSoyad, setAdSoyad] = React.useState("");
  const [kullaniciAdi, setKullaniciAdi] = React.useState("");
  const [sifre, setSifre] = React.useState("");
  const [rol, setRol] = React.useState("izleyici");
  const [yukleniyor, setYukleniyor] = React.useState(false);

  function sifirla() {
    setAdSoyad("");
    setKullaniciAdi("");
    setSifre("");
    setRol("izleyici");
  }

  async function olustur() {
    if (yukleniyor) return;
    setYukleniyor(true);
    try {
      const yanit = await fetch("/api/kullanici-olustur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adSoyad, kullaniciAdi, sifre, rol }),
      });
      const metin = await yanit.text();
      const sonuc = metin ? JSON.parse(metin) : {};
      if (!yanit.ok) {
        toast.error(t("Kullanıcı oluşturulamadı"), { description: sonuc?.hata ?? `HTTP ${yanit.status}` });
        return;
      }
      toast.success(`${kullaniciAdi} ${t("kullanıcısı oluşturuldu")}`);
      qc.invalidateQueries({ queryKey: queryKeys.kullanicilar.analiz });
      sifirla();
      setAcik(false);
    } catch (e) {
      toast.error(t("Kullanıcı oluşturulamadı"), {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <Sheet open={acik} onOpenChange={(o) => { if (o) sifirla(); setAcik(o); }}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{t("Yeni Kullanıcı")}</SheetTitle>
          <SheetDescription>{t("Kullanıcı adı ve şifre ile yeni hesap oluşturun.")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="space-y-1.5">
            <Label htmlFor="ko-ad" className="text-xs text-muted-foreground">{t("Ad Soyad")}</Label>
            <Input id="ko-ad" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} placeholder={t("Örn. Ayşe Demir")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ko-kadi" className="text-xs text-muted-foreground">{t("Kullanıcı Adı")}</Label>
            <Input id="ko-kadi" value={kullaniciAdi} onChange={(e) => setKullaniciAdi(e.target.value)} placeholder="ayse.demir" autoComplete="off" />
            <p className="text-[11px] text-muted-foreground">{t("En az 3 karakter; harf, rakam, . _ -")}</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ko-sifre" className="text-xs text-muted-foreground">{t("Şifre")}</Label>
            <Input id="ko-sifre" type="text" value={sifre} onChange={(e) => setSifre(e.target.value)} placeholder={t("En az 6 karakter")} autoComplete="new-password" />
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
          <Button className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700" disabled={yukleniyor} onClick={olustur}>
            <Icon icon={yukleniyor ? "svg-spinners:180-ring" : "solar:user-plus-bold-duotone"} className="size-4" />
            {t("Oluştur")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
