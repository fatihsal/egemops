"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

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
import type { Kullanici } from "@/lib/types";

const ROLLER = Object.entries(ROL_META).map(([k, m]) => ({ k, e: m.etiket }));
const DEPARTMANLAR = ["Enerji Yönetimi", "Bakım Onarım", "Üretim", "Satın Alma", "Finans", "Kalite", "Yönetim"];

export function KullaniciFormDrawer({ kullanici, trigger }: { kullanici?: Kullanici; trigger: React.ReactElement }) {
  const duzenle = !!kullanici;
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
    if (!ad.trim() || !email.trim()) { toast.error("Ad ve e-posta zorunludur"); return; }
    toast.success(duzenle ? `${ad} güncellendi` : `${email} adresine davet gönderildi`);
    setAcik(false);
  };

  return (
    <Sheet open={acik} onOpenChange={(o) => { if (o) sifirla(); setAcik(o); }}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{duzenle ? "Kullanıcıyı Düzenle" : "Kullanıcı Davet Et"}</SheetTitle>
          <SheetDescription>{duzenle ? "Rol, departman ve bilgileri güncelleyin." : "Yeni kullanıcıya e-posta ile davet gönderin."}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="space-y-1.5">
            <Label htmlFor="k-ad" className="text-xs text-muted-foreground">Ad Soyad</Label>
            <Input id="k-ad" value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Örn. Ayşe Demir" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="k-email" className="text-xs text-muted-foreground">E-posta</Label>
            <Input id="k-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ad.soyad@egemops.com" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Rol</Label>
            <Select value={rol} onValueChange={(v) => setRol(v as string)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{ROLLER.map((r) => <SelectItem key={r.k} value={r.e}>{r.e}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Departman</Label>
            <Select value={departman} onValueChange={(v) => setDepartman(v as string)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{DEPARTMANLAR.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>İptal</SheetClose>
          <Button className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700" onClick={kaydet}>
            <Icon icon={duzenle ? "solar:diskette-bold-duotone" : "solar:letter-bold-duotone"} className="size-4" />
            {duzenle ? "Kaydet" : "Davet Gönder"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
