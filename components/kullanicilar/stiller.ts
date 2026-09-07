// Kullanıcılar — paylaşılan renk/etiket eşlemeleri.

import type { KullaniciDurum, KullaniciRol } from "@/lib/types";

export const ROL_META: Record<KullaniciRol, { etiket: string; sinif: string; aciklama: string }> = {
  yonetici: { etiket: "Yönetici", sinif: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300", aciklama: "Tüm ayarlar ve kullanıcı yönetimi" },
  editor: { etiket: "Editör", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", aciklama: "Veri girişi ve rapor oluşturma" },
  goruntuleyici: { etiket: "Görüntüleyici", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", aciklama: "Yalnızca görüntüleme" },
};

export const DURUM_META: Record<KullaniciDurum, { etiket: string; sinif: string; nokta: string }> = {
  aktif: { etiket: "Aktif", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", nokta: "bg-emerald-500" },
  pasif: { etiket: "Pasif", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", nokta: "bg-slate-400" },
  davet: { etiket: "Davet Bekliyor", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", nokta: "bg-amber-500" },
};
