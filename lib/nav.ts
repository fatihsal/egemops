// Sol menü yapılandırması — modül bazlı, tek kaynak.
// Her grup bir modüle aittir; aktif modül URL'den türetilir.
// Yeni ekran eklerken ilgili modülün grubuna bir satır eklemek yeterli.

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Archive,
  BarChart3,
  CalendarDays,
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
  Lightbulb,
  ListChecks,
  PencilLine,
  PieChart,
  Settings,
  SlidersHorizontal,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

export type ModulAnahtar = "enerji" | "bakim";

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
  renk: string; // vurgu rengi (tailwind token olmayan, inline)
}

export const moduller: ModulBilgi[] = [
  {
    anahtar: "enerji",
    ad: "Enerji Yönetimi",
    aciklama: "Tüketim, TEP, GES, maliyet ve performans takibi",
    ikon: Zap,
    href: "/enerji",
    renk: "#14b8a6",
  },
  {
    anahtar: "bakim",
    ad: "Bakım Yönetimi",
    aciklama: "Planlı bakım, SOP, iş emri ve ekipman takibi",
    ikon: Wrench,
    href: "/bakim",
    renk: "#2563eb",
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
      { baslik: "Bakım Takvimi", href: "/bakim/takvim", ikon: CalendarDays },
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
];

/** Verilen yola göre aktif modülü döndürür. */
export function aktifModul(pathname: string): ModulAnahtar {
  return pathname === "/bakim" || pathname.startsWith("/bakim/") ? "bakim" : "enerji";
}

/** Modül kök rotaları (sidebar'da yalnızca tam eşleşmede aktif). */
export const MODUL_KOKLERI = ["/enerji", "/bakim"];

/** Aktif modülün nav gruplarını döndürür. */
export function modulGruplari(modul: ModulAnahtar): NavGrup[] {
  return navGruplari.filter((g) => g.modul === modul);
}
