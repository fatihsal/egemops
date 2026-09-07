# EgemOps — Enerji Yönetim Paneli

Kurumsal bir enerji yönetimi yönetim panelinin **frontend** uygulaması. Tüketim, üretim, TEP, maliyet, verimlilik fırsatları, projeler ve raporlamayı tek bir açık temalı arayüzde toplar.

> **Not:** Bu aşamada uygulama **yalnızca frontend**'tir. Backend, veritabanı, API, gerçek PDF/Excel üretimi veya kimlik doğrulama içermez. Tüm veriler `lib/data/` altındaki **mock (sahte) veri** katmanından gelir. Yükleme/kaydetme/indirme gibi eylemler `sonner` toast bildirimleriyle taklit edilir.

---

## Teknoloji Yığını

| Alan | Teknoloji |
|---|---|
| Framework | **Next.js 16** (App Router, React Server Components) |
| UI | **React 19**, **TypeScript** (strict) |
| Stil | **Tailwind CSS 4**, `tailwind-merge`, `tw-animate-css` |
| Bileşenler | shadcn/ui deseni + **@base-ui/react** primitifleri |
| Veri/State | **@tanstack/react-query v5** |
| Grafikler | **recharts v3** |
| İkonlar | **@iconify** (Solar seti) — offline bundle (`scripts/extract-icons.mjs`) |
| Diğer | `date-fns`, `react-day-picker`, `sonner`, `next-themes` |

---

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) açın.

### Faydalı komutlar

```bash
npm run dev          # Geliştirme sunucusu
npx tsc --noEmit     # Tip kontrolü (doğrulama için önerilen)
npm run icons        # Kaynakta kullanılan solar:/vscode-icons: ikonlarını offline bundle et
npm run lint         # ESLint
npm run build        # Üretim derlemesi
```

> **İkon kuralı:** Koda yeni bir `solar:*` ikonu eklendiğinde `npm run icons` çalıştırılmalıdır. Komut "Çıkarılan ikon: N / M" raporu verir; N < M ise eksik ikon adını gösterir (geçersiz ikon).

---

## Proje Yapısı & Mimari

Her sayfa aynı **katmanlı mimariyi** izler:

```
lib/types.ts              → Paylaşılan TypeScript tipleri (API sözleşmesi)
lib/data/<sayfa>.ts       → Mock veri getirici (gecikmeIle ile ağ gecikmesi taklidi)
lib/queries/keys.ts       → TanStack Query anahtarları (tek kaynak)
lib/queries/<sayfa>.ts    → use<Sayfa>Analiz() hook'u
components/<sayfa>/*.tsx   → Sayfaya özel bileşenler (kpi, tablolar, grafikler, drawer'lar…)
app/<sayfa>/page.tsx      → Sayfa kompozisyonu (RSC)
```

Backend eklendiğinde **yalnızca `lib/data/` içindeki fonksiyonların içi** değişir; imzalar sabit kaldığı sürece ekranlar etkilenmez.

Ortak öğeler:
- `lib/nav.ts` — sol menü yapılandırması (tek kaynak)
- `lib/format.ts` — Türkçe sayı/para biçimlendirme yardımcıları
- `components/ui/*` — temel bileşenler (Button, Card, Table, Sheet, Select…)
- `components/layout/*` — sidebar, header, mobil menü

---

## Sayfalar

| Bölüm | Route | Açıklama |
|---|---|---|
| **Ana Sayfa** | `/` | Dashboard — genel enerji özeti |
| **Enerji Yönetimi** | `/veri-girisi` | Aylık Veri Girişi |
| | `/enerji-kayitlari` | Enerji Kayıtları |
| | `/elektrik-ges` | Elektrik & GES |
| | `/dogalgaz` | Doğalgaz |
| | `/akaryakit` | Akaryakıt |
| | `/tep-analizi` | TEP Analizi |
| | `/enerji-performansi` | Enerji Performansı (EnPI) |
| **Enerji Fırsatları** | `/firsatlar` | Enerji Fırsatları |
| | `/projeler` | Enerji Projeleri (Gantt, bütçe, sağlık) |
| **Raporlar** | `/raporlar` | Rapor merkezi + `/raporlar/[id]` önizleme |
| | `/yonetim-ozeti` | Yönetim Özeti (executive dashboard) |
| **Doküman Yönetimi** | `/belgeler` | Belge/doküman merkezi |
| **Ayarlar** | `/katsayilar` | Katsayılar (TEP/emisyon/fiyat) |
| | `/kullanicilar` | Kullanıcı yönetimi |
| | `/ayarlar` | Ayarlar (profil, kurum, bildirim, entegrasyon) |

---

## Tasarım Sistemi

Açık tema, kurumsal SaaS estetiği:

- **Ana içerik:** beyaz / çok açık gri · **Sidebar:** koyu lacivert · **Kartlar:** beyaz, ince gri border, soft shadow
- **Ana vurgu:** teal / cyan
- **Enerji renkleri:** Elektrik → mavi · Doğalgaz → mor · Akaryakıt → amber
- **Durum renkleri:** başarı → yeşil · uyarı/taslak → amber · kritik/hata → kırmızı
- Koyu tema `next-themes` ile desteklenir (header'daki tema düğmesi).

---

## Notlar

- Grafikler ilk RSC render'ında geçici olarak ölçüm bekleyebilir; tam-genişlik grafik kartlarında konteynerlere sabit yükseklik verilerek bu giderilmiştir.
- Doğrulama için `npm run build` yerine `npx tsc --noEmit` tercih edilir (HMR bozulmasını önler).
