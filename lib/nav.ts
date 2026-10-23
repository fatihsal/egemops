// Sol menü yapılandırması — modül bazlı, tek kaynak.
// Her grup bir modüle aittir; aktif modül URL'den türetilir.
// Yeni ekran eklerken ilgili modülün grubuna bir satır eklemek yeterli.

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Archive,
  BarChart3,
  ClipboardCheck,
  ClipboardList,
  Cpu,
  FileText,
  Flame,
  FolderClosed,
  FolderKanban,
  Fuel,
  Gauge,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  ListChecks,
  PencilLine,
  PieChart,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

export type ModulAnahtar = "enerji" | "bakim" | "satinalma";

export interface NavOgesi {
  baslik: string;
  href: string;
  ikon: LucideIcon;
}

export interface NavGrup {
  baslik: string;
  modul: ModulAnahtar;
  ogeler: NavOgesi[];
}

/** Uygulama hub'ındaki (modül seçim ekranı) modüller. */
export interface ModulBilgi {
  anahtar: ModulAnahtar;
  ad: string;
  aciklama: string;
  ikon: LucideIcon;
  href: string; // modüle giriş rotası
  renk: string; // vurgu rengi (inline)
  renk2: string; // gradyan ikinci renk
  rozet: string; // kart sağ üst rozet metni
  ctaMetin: string; // buton metni
  oneCikanlar: string[]; // kartta gösterilen başlıca özellikler
  gorsel: string; // kart içi dekoratif görsel (public/)
}

export const moduller: ModulBilgi[] = [
  {
    anahtar: "enerji",
    ad: "Enerji Yönetimi",
    aciklama: "Enerji tüketimlerinizi izleyin, analiz edin ve verimliliğinizi artırın.",
    ikon: Leaf,
    href: "/enerji",
    renk: "#10b981",
    renk2: "#059669",
    rozet: "Aktif",
    ctaMetin: "Enerji Yönetimine Git",
    oneCikanlar: ["Enerji izleme ve analiz", "Tüketim raporları", "Verimlilik takibi"],
    gorsel: "/kart-enerji.png",
  },
  {
    anahtar: "bakim",
    ad: "Bakım Yönetimi",
    aciklama: "Planlı bakım faaliyetlerinizi yönetin, kayıt altına alın ve sürekliliği sağlayın.",
    ikon: Settings,
    href: "/bakim",
    renk: "#2563eb",
    renk2: "#1d4ed8",
    rozet: "Planlı Bakım",
    ctaMetin: "Bakım Yönetimine Git",
    oneCikanlar: ["Bakım planları ve takvimi", "SOP / checklist yönetimi", "Bakım kayıtları ve raporlar"],
    gorsel: "/kart-bakim.png",
  },
  {
    anahtar: "satinalma",
    ad: "Akıllı Teknik Satın Alma",
    aciklama: "Malzeme taleplerini yapay zekâ ile oluşturun, tedarikçi tekliflerini toplayın ve karşılaştırın.",
    ikon: ShoppingCart,
    href: "/satinalma",
    renk: "#f97316",
    renk2: "#ea580c",
    rozet: "MVP",
    ctaMetin: "Satın Almaya Git",
    oneCikanlar: ["Görselden AI ürün önerisi", "Tedarikçi teklif talepleri", "Teklif karşılaştırma"],
    gorsel: "/kart-satinalma.png",
  },
];

export const navGruplari: NavGrup[] = [
  // ----------------------------- ENERJİ -----------------------------
  {
    baslik: "Ana Sayfa",
    modul: "enerji",
    ogeler: [{ baslik: "Dashboard", href: "/enerji", ikon: LayoutDashboard }],
  },
  {
    baslik: "Enerji Yönetimi",
    modul: "enerji",
    ogeler: [
      { baslik: "Aylık Veri Girişi", href: "/veri-girisi", ikon: PencilLine },
      { baslik: "Enerji Kayıtları", href: "/enerji-kayitlari", ikon: ClipboardList },
      { baslik: "Elektrik & GES", href: "/elektrik-ges", ikon: Zap },
      { baslik: "Doğalgaz", href: "/dogalgaz", ikon: Flame },
      { baslik: "Akaryakıt", href: "/akaryakit", ikon: Fuel },
      { baslik: "TEP Analizi", href: "/tep-analizi", ikon: BarChart3 },
      { baslik: "Enerji Performansı", href: "/enerji-performansi", ikon: Gauge },
    ],
  },
  {
    baslik: "Enerji Fırsatları",
    modul: "enerji",
    ogeler: [
      { baslik: "Fırsatlar", href: "/firsatlar", ikon: Lightbulb },
      { baslik: "Projeler", href: "/projeler", ikon: FolderKanban },
    ],
  },
  {
    baslik: "Raporlar",
    modul: "enerji",
    ogeler: [
      { baslik: "Raporlar", href: "/raporlar", ikon: FileText },
      { baslik: "Yönetim Özeti", href: "/yonetim-ozeti", ikon: PieChart },
    ],
  },
  {
    baslik: "Dokümanlar",
    modul: "enerji",
    ogeler: [{ baslik: "Belgeler", href: "/belgeler", ikon: FolderClosed }],
  },
  {
    baslik: "Ayarlar",
    modul: "enerji",
    ogeler: [
      { baslik: "Katsayılar", href: "/katsayilar", ikon: SlidersHorizontal },
      { baslik: "Kullanıcılar", href: "/kullanicilar", ikon: Users },
      { baslik: "Ayarlar", href: "/ayarlar", ikon: Settings },
    ],
  },

  // ----------------------------- BAKIM -----------------------------
  {
    baslik: "Bakım Yönetimi",
    modul: "bakim",
    ogeler: [
      { baslik: "Dashboard", href: "/bakim", ikon: LayoutDashboard },
      { baslik: "Makine & Ekipmanlar", href: "/bakim/makineler", ikon: Cpu },
      { baslik: "Bakım Planları", href: "/bakim/planlar", ikon: ClipboardList },
      { baslik: "Planlı İş Emirleri", href: "/bakim/is-emirleri", ikon: ClipboardCheck },
      { baslik: "Bakım Kayıtları", href: "/bakim/kayitlar", ikon: Archive },
      { baslik: "SOP & Checklistler", href: "/bakim/sop", ikon: ListChecks },
      { baslik: "Bakım Bulguları", href: "/bakim/bulgular", ikon: AlertTriangle },
      { baslik: "Operatör Kontrolleri", href: "/bakim/operator-kontrolleri", ikon: ClipboardList },
      { baslik: "Dokümanlar", href: "/bakim/dokumanlar", ikon: FolderClosed },
      { baslik: "KPI & Raporlar", href: "/bakim/raporlar", ikon: BarChart3 },
    ],
  },
  {
    baslik: "Ayarlar",
    modul: "bakim",
    ogeler: [{ baslik: "Ayarlar", href: "/bakim/ayarlar", ikon: Settings }],
  },

  // -------------------------- SATIN ALMA --------------------------
  {
    baslik: "Satın Alma",
    modul: "satinalma",
    ogeler: [
      { baslik: "Dashboard", href: "/satinalma", ikon: LayoutDashboard },
      { baslik: "Malzeme Talepleri", href: "/satinalma/talepler", ikon: ClipboardList },
      { baslik: "Tedarikçiler", href: "/satinalma/tedarikciler", ikon: Truck },
    ],
  },
  {
    baslik: "Ayarlar",
    modul: "satinalma",
    ogeler: [{ baslik: "Ayarlar", href: "/satinalma/ayarlar", ikon: Settings }],
  },
];

/** Verilen yola göre aktif modülü döndürür. */
export function aktifModul(pathname: string): ModulAnahtar {
  if (pathname === "/satinalma" || pathname.startsWith("/satinalma/")) return "satinalma";
  if (pathname === "/bakim" || pathname.startsWith("/bakim/")) return "bakim";
  return "enerji";
}

/** Modül kök rotaları (sidebar'da yalnızca tam eşleşmede aktif). */
export const MODUL_KOKLERI = ["/enerji", "/bakim", "/satinalma"];

/** Aktif modülün nav gruplarını döndürür. */
export function modulGruplari(modul: ModulAnahtar): NavGrup[] {
  return navGruplari.filter((g) => g.modul === modul);
}
