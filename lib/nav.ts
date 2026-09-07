// Sol menü yapılandırması — tek kaynak, bölümlere ayrılmış.
// Yeni ekran eklerken ilgili gruba bir satır eklemek yeterli.

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ClipboardList,
  FileText,
  Flame,
  FolderClosed,
  FolderKanban,
  Fuel,
  Gauge,
  LayoutDashboard,
  Lightbulb,
  PencilLine,
  PieChart,
  Settings,
  SlidersHorizontal,
  Users,
  Zap,
} from "lucide-react";

export interface NavOgesi {
  baslik: string;
  href: string;
  ikon: LucideIcon;
}

export interface NavGrup {
  baslik: string;
  ogeler: NavOgesi[];
}

export const navGruplari: NavGrup[] = [
  {
    baslik: "Ana Sayfa",
    ogeler: [{ baslik: "Dashboard", href: "/", ikon: LayoutDashboard }],
  },
  {
    baslik: "Enerji Yönetimi",
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
    ogeler: [
      { baslik: "Fırsatlar", href: "/firsatlar", ikon: Lightbulb },
      { baslik: "Projeler", href: "/projeler", ikon: FolderKanban },
    ],
  },
  {
    baslik: "Raporlar",
    ogeler: [
      { baslik: "Raporlar", href: "/raporlar", ikon: FileText },
      { baslik: "Yönetim Özeti", href: "/yonetim-ozeti", ikon: PieChart },
    ],
  },
  {
    baslik: "Dokümanlar",
    ogeler: [{ baslik: "Belgeler", href: "/belgeler", ikon: FolderClosed }],
  },
  {
    baslik: "Ayarlar",
    ogeler: [
      { baslik: "Katsayılar", href: "/katsayilar", ikon: SlidersHorizontal },
      { baslik: "Kullanıcılar", href: "/kullanicilar", ikon: Users },
      { baslik: "Ayarlar", href: "/ayarlar", ikon: Settings },
    ],
  },
];
