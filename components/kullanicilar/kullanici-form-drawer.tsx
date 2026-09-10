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
import { ROL_META } from "@/components/kullanicilar/stiller";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import type { Kullanici, KullaniciAnaliz, KullaniciRol } from "@/lib/types";

const ROLLER = Object.entries(ROL_META).map(([k, m]) => ({ k, e: m.etiket }));
const DEPARTMANLAR = ["Enerji Yönetimi", "Bakım Onarım", "Üretim", "Satın Alma", "Finans", "Kalite", "Yönetim"];
const RENKLER = ["#0d9488", "#2563eb", "#f59e0b", "#8b5cf6", "#0891b2", "#ec4899", "#16a34a", "#dc2626"];

function basHarfleri(ad: string) {
  const p = ad.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toLocaleUpperCase("tr");
}
function rolAnahtar(etiket: string): KullaniciRol {
  return ((Object.keys(ROL_META) as KullaniciRol[]).find((k) => ROL_META[k].etiket === etiket)) ?? "editor";
}

export function KullaniciFormDrawer({ kullanici, trigger }: { kullanici?: Kullanici; trigger: React.ReactElement }) {
  const { t } = useDil();
  const duzenle = !!kullanici;
  const qc = useQueryClient();
  const [acik, setAcik] = React.useState(false);
  const [ad, setAd] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [rol, setRol] = React.useState("Editör");
  const [departman, setDepartman] = React.useState("Enerji Yönetimi");

  const sifirla = () => {
    setAd(kullanici?.ad ?? "");
    setEmail(kullanici?.email ?? "");
    setRol(kullanici ? ROL_META[kullanici.rol].etiket : "Editör");
    setDepartman(kullanici?.departman ?? "Enerji Yönetimi");
  };

  const kaydet = () => {
    if (!ad.trim() || !email.trim()) { toast.error(t("Ad ve e-posta zorunludur")); return; }
    const rolK = rolAnahtar(rol);
    qc.setQueryData(queryKeys.kullanicilar.analiz, (old?: KullaniciAnaliz) => {
      if (!old) return old;
      if (duzenle && kullanici) {
        return { ...old, kullanicilar: old.kullanicilar.map((u) => u.id === kullanici.id ? { ...u, ad, email, rol: rolK, departman } : u) };
      }
      const yeni: Kullanici = {
        id: `u-${Date.now()}`, ad, email, bas: basHarfleri(ad) || "?",
        renk: RENKLER[old.kullanicilar.length % RENKLER.length], rol: rolK,
        departman, durum: "davet", sonGiris: "—",
      };
      return { ...old, kullanicilar: [yeni, ...old.kullanicilar] };
    });
    toast.success(duzenle ? `${ad} ${t("güncellendi")}` : `${email} ${t("adresine davet gönderildi")}`);
    setAcik(false);
  };

  return (
    <Sheet open={acik} onOpenChange={(o) => { if (o) sifirla(); setAcik(o); }}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{duzenle ? t("Kullanıcıyı Düzenle") : t("Kullanıcı Davet Et")}</SheetTitle>
          <SheetDescription>{duzenle ? t("Rol, departman ve bilgileri güncelleyin.") : t("Yeni kullanıcıya e-posta ile davet gönderin.")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="space-y-1.5">
            <Label htmlFor="k-ad" className="text-xs text-muted-foreground">{t("Ad Soyad")}</Label>
            <Input id="k-ad" value={ad} onChange={(e) => setAd(e.target.value)} placeholder={t("Örn. Ayşe Demir")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="k-email" className="text-xs text-muted-foreground">{t("E-posta")}</Label>
            <Input id="k-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ad.soyad@egemops.com" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("Rol")}</Label>
            <Select value={rol} onValueChange={(v) => setRol(v as string)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{ROLLER.map((r) => <SelectItem key={r.k} value={r.e}>{t(r.e)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("Departman")}</Label>
            <Select value={departman} onValueChange={(v) => setDepartman(v as string)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{DEPARTMANLAR.map((d) => <SelectItem key={d} value={d}>{t(d)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>{t("İptal")}</SheetClose>
          <Button className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700" onClick={kaydet}>
            <Icon icon={duzenle ? "solar:diskette-bold-duotone" : "solar:letter-bold-duotone"} className="size-4" />
            {duzenle ? t("Kaydet") : t("Davet Gönder")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
