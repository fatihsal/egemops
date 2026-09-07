"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function Bolum({ ikon, sinif, baslik, aciklama, children, footer }: {
  ikon: string; sinif: string; baslik: string; aciklama: string; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", sinif)}>
          <Icon icon={ikon} className="size-5" />
        </span>
        <div>
          <h3 className="font-heading text-base font-medium">{baslik}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{aciklama}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
      {footer ? <div className="flex justify-end border-t px-(--card-spacing) py-3">{footer}</div> : null}
    </Card>
  );
}

function Alan({ etiket, htmlFor, children, tam }: { etiket: string; htmlFor?: string; children: React.ReactNode; tam?: boolean }) {
  return (
    <div className={cn("space-y-1.5", tam && "sm:col-span-2")}>
      <Label htmlFor={htmlFor} className="text-xs text-muted-foreground">{etiket}</Label>
      {children}
    </div>
  );
}

function Toggle({ acik, onToggle }: { acik: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={acik}
      onClick={onToggle}
      className={cn("relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors", acik ? "bg-teal-500" : "bg-muted")}
    >
      <span className={cn("inline-block size-4 rounded-full bg-white shadow transition-transform", acik ? "translate-x-4" : "translate-x-0.5")} />
    </button>
  );
}

function SwitchSatir({ baslik, aciklama, acik, onToggle }: { baslik: string; aciklama: string; acik: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3 first:pt-0 last:border-b-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{baslik}</p>
        <p className="text-xs text-muted-foreground">{aciklama}</p>
      </div>
      <Toggle acik={acik} onToggle={onToggle} />
    </div>
  );
}

const SEKTORLER = ["Gıda", "Tekstil", "Metal & Döküm", "Kimya", "Otomotiv", "Cam & Seramik", "Kağıt", "Çimento"];
const KAYDET = <Button className="h-9 gap-1.5 bg-teal-600 text-white hover:bg-teal-700" onClick={() => toast.success("Ayarlar kaydedildi")}><Icon icon="solar:diskette-bold-duotone" className="size-4" />Kaydet</Button>;

const ENTEGRASYONLAR = [
  { ad: "SCADA / PLC Sistemi", aciklama: "Gerçek zamanlı üretim ve enerji verisi", ikon: "solar:cpu-bolt-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", bagli: true },
  { ad: "Akıllı Sayaç Sistemi", aciklama: "Elektrik, doğalgaz ve su sayaçları", ikon: "solar:speedometer-max-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300", bagli: true },
  { ad: "Muhasebe (ERP)", aciklama: "Fatura ve maliyet aktarımı", ikon: "solar:bill-list-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300", bagli: false },
  { ad: "Hava Durumu Servisi", aciklama: "Derece-gün ve iklim düzeltmesi", ikon: "solar:cloud-sun-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300", bagli: true },
];

export function AyarlarIcerik() {
  const [bildirim, setBildirim] = React.useState({ sure: true, rapor: true, hedef: true, haftalik: false, duyuru: true });
  const [tema, setTema] = React.useState("sistem");
  const [ikiAdim, setIkiAdim] = React.useState(true);
  const bd = (k: keyof typeof bildirim) => setBildirim((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="space-y-6">
      {/* Profil */}
      <Bolum ikon="solar:user-circle-bold-duotone" sinif="bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" baslik="Profil" aciklama="Hesap bilgilerinizi güncelleyin" footer={KAYDET}>
        <div className="flex items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#0d9488] text-lg font-bold text-white">UM</span>
          <Button variant="outline" className="gap-1.5 bg-card" onClick={() => toast("Fotoğraf yükleme açılıyor")}>
            <Icon icon="solar:camera-bold-duotone" className="size-4" />Fotoğrafı Değiştir
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Alan etiket="Ad Soyad" htmlFor="p-ad"><Input id="p-ad" defaultValue="Uğur Melih" /></Alan>
          <Alan etiket="Ünvan" htmlFor="p-unvan"><Input id="p-unvan" defaultValue="Enerji Yöneticisi" /></Alan>
          <Alan etiket="E-posta" htmlFor="p-email"><Input id="p-email" type="email" defaultValue="ugur.melih@egemops.com" /></Alan>
          <Alan etiket="Telefon" htmlFor="p-tel"><Input id="p-tel" defaultValue="+90 5xx xxx xx xx" /></Alan>
        </div>
      </Bolum>

      {/* Kurum & Tesis */}
      <Bolum ikon="solar:buildings-2-bold-duotone" sinif="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" baslik="Kurum & Tesis" aciklama="Firma ve tesis bilgileri" footer={KAYDET}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Alan etiket="Firma Adı" htmlFor="k-firma"><Input id="k-firma" defaultValue="Egem Enerji A.Ş." /></Alan>
          <Alan etiket="Tesis Adı" htmlFor="k-tesis"><Input id="k-tesis" defaultValue="İzmir Üretim Tesisi" /></Alan>
          <Alan etiket="Sektör">
            <Select defaultValue="Metal & Döküm">
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{SEKTORLER.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Alan>
          <Alan etiket="Vergi No" htmlFor="k-vergi"><Input id="k-vergi" defaultValue="1234567890" /></Alan>
          <Alan etiket="Adres" htmlFor="k-adres" tam><Textarea id="k-adres" rows={2} defaultValue="Atatürk O.S.B. Mah. 10001 Sk. No:5, Çiğli / İzmir" /></Alan>
        </div>
      </Bolum>

      {/* Bildirimler */}
      <Bolum ikon="solar:bell-bold-duotone" sinif="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" baslik="Bildirimler" aciklama="Hangi durumlarda bilgilendirilmek istediğinizi seçin">
        <div>
          <SwitchSatir baslik="Belge süre dolumu uyarıları" aciklama="Sertifika/sözleşme süresi yaklaşınca bildir" acik={bildirim.sure} onToggle={() => bd("sure")} />
          <SwitchSatir baslik="Rapor hazır bildirimi" aciklama="Oluşturulan rapor tamamlandığında bildir" acik={bildirim.rapor} onToggle={() => bd("rapor")} />
          <SwitchSatir baslik="Hedef sapması uyarısı" aciklama="EnPI hedefinden sapma olduğunda bildir" acik={bildirim.hedef} onToggle={() => bd("hedef")} />
          <SwitchSatir baslik="Haftalık özet e-postası" aciklama="Her pazartesi haftalık enerji özeti gönder" acik={bildirim.haftalik} onToggle={() => bd("haftalik")} />
          <SwitchSatir baslik="Sistem duyuruları" aciklama="Bakım ve güncelleme bildirimleri" acik={bildirim.duyuru} onToggle={() => bd("duyuru")} />
        </div>
      </Bolum>

      {/* Görünüm & Bölge */}
      <Bolum ikon="solar:palette-bold-duotone" sinif="bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" baslik="Görünüm & Bölge" aciklama="Tema, dil ve bölgesel biçim tercihleri" footer={KAYDET}>
        <Alan etiket="Tema">
          <div className="inline-flex rounded-lg border bg-muted/40 p-1">
            {[["acik", "Açık", "solar:sun-bold"], ["koyu", "Koyu", "solar:moon-bold"], ["sistem", "Sistem", "solar:monitor-bold"]].map(([k, e, ic]) => (
              <button key={k} type="button" onClick={() => setTema(k)}
                className={cn("inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors", tema === k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                <Icon icon={ic} className="size-4" />{e}
              </button>
            ))}
          </div>
        </Alan>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Alan etiket="Dil">
            <Select defaultValue="Türkçe"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{["Türkçe", "English"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
          </Alan>
          <Alan etiket="Para Birimi">
            <Select defaultValue="TL (₺)"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{["TL (₺)", "EUR (€)", "USD ($)"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
          </Alan>
          <Alan etiket="Tarih Formatı">
            <Select defaultValue="GG.AA.YYYY"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{["GG.AA.YYYY", "YYYY-AA-GG"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
          </Alan>
          <Alan etiket="Birim Sistemi">
            <Select defaultValue="TEP / kWh"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{["TEP / kWh", "GJ / MWh"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
          </Alan>
        </div>
      </Bolum>

      {/* Güvenlik */}
      <Bolum ikon="solar:lock-password-bold-duotone" sinif="bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300" baslik="Güvenlik" aciklama="Parola ve oturum güvenliği">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
          <div>
            <p className="text-sm font-medium">Parola</p>
            <p className="text-xs text-muted-foreground">Son değişiklik: 3 ay önce</p>
          </div>
          <Button variant="outline" className="gap-1.5 bg-card" onClick={() => toast.success("Parola sıfırlama bağlantısı e-postanıza gönderildi")}>
            <Icon icon="solar:key-bold-duotone" className="size-4" />Parolayı Değiştir
          </Button>
        </div>
        <SwitchSatir baslik="İki Adımlı Doğrulama (2FA)" aciklama="Girişte ek doğrulama kodu iste" acik={ikiAdim} onToggle={() => setIkiAdim((v) => !v)} />
        <Alan etiket="Oturum Zaman Aşımı">
          <Select defaultValue="30 dakika"><SelectTrigger className="w-full sm:w-[220px]"><SelectValue /></SelectTrigger><SelectContent>{["15 dakika", "30 dakika", "1 saat", "4 saat"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
        </Alan>
      </Bolum>

      {/* Entegrasyonlar */}
      <Bolum ikon="solar:plug-circle-bold-duotone" sinif="bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300" baslik="Entegrasyonlar" aciklama="Bağlı sistemler ve veri kaynakları">
        <ul className="space-y-2.5">
          {ENTEGRASYONLAR.map((e) => (
            <li key={e.ad} className="flex items-center gap-3 rounded-xl border p-3">
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", e.sinif)}>
                <Icon icon={e.ikon} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{e.ad}</p>
                <p className="truncate text-xs text-muted-foreground">{e.aciklama}</p>
              </div>
              {e.bagli ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-500" />Bağlı
                </span>
              ) : (
                <Button size="sm" variant="outline" className="h-8 gap-1.5 bg-card" onClick={() => toast.success(`${e.ad} bağlantısı başlatılıyor`)}>
                  <Icon icon="solar:link-bold-duotone" className="size-4" />Bağlan
                </Button>
              )}
            </li>
          ))}
        </ul>
      </Bolum>
    </div>
  );
}
