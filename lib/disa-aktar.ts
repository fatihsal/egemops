// İstemci tarafı CSV dışa aktarma. Excel'in Türkçe yerelinde varsayılan ayraç
// noktalı virgül (;) olduğu ve Türkçe karakterlerin bozulmaması için başa UTF-8
// BOM eklenir. Blob + <a download> ile gerçek dosya indirilir.

type Hucre = string | number | null | undefined;

function kacir(deger: Hucre): string {
  const s = String(deger ?? "");
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Tabloyu gerçek bir PDF dosyası olarak doğrudan indirir (jsPDF + html2canvas).
 *  Türkçe karakterler tarayıcı ile görüntülenip rasterize edildiği için düzgün çıkar. */
export async function pdfYazdir(baslik: string, basliklar: string[], satirlar: Hucre[][]): Promise<void> {
  const esc = (s: Hucre) =>
    String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] ?? c));
  const tarih = new Date().toLocaleDateString("tr-TR");

  const el = document.createElement("div");
  el.style.cssText = "position:fixed;left:-99999px;top:0;width:1000px;background:#fff;padding:28px;color:#0f172a;font-family:Arial,Helvetica,sans-serif;";
  el.innerHTML = `
    <h1 style="font-size:20px;margin:0 0 4px">${esc(baslik)}</h1>
    <p style="color:#64748b;font-size:13px;margin:0 0 20px">EgemOps · ${esc(tarih)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead><tr style="background:#f1f5f9">${basliklar.map((b) => `<th style="border:1px solid #e2e8f0;padding:7px 10px;text-align:left;font-weight:600">${esc(b)}</th>`).join("")}</tr></thead>
      <tbody>${satirlar.map((r, i) => `<tr style="background:${i % 2 ? "#f8fafc" : "#fff"}">${r.map((c) => `<td style="border:1px solid #e2e8f0;padding:6px 10px">${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>`;
  document.body.appendChild(el);

  try {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import("jspdf"),
      import("html2canvas-pro"),
    ]);
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const kenar = 10;
    const sayfaG = pdf.internal.pageSize.getWidth();
    const sayfaY = pdf.internal.pageSize.getHeight();
    const imgG = sayfaG - kenar * 2;
    const imgY = (canvas.height * imgG) / canvas.width;
    const kullanimY = sayfaY - kenar * 2;
    const img = canvas.toDataURL("image/png");

    let kalan = imgY;
    let konum = kenar;
    pdf.addImage(img, "PNG", kenar, konum, imgG, imgY);
    kalan -= kullanimY;
    while (kalan > 0) {
      konum = kenar - (imgY - kalan);
      pdf.addPage();
      pdf.addImage(img, "PNG", kenar, konum, imgG, imgY);
      kalan -= kullanimY;
    }

    const ad = baslik.toLowerCase().replace(/[^\wğüşıöç.-]+/gi, "_");
    pdf.save(ad.endsWith(".pdf") ? ad : `${ad}.pdf`);
  } finally {
    el.remove();
  }
}

export function csvIndir(
  dosyaAdi: string,
  basliklar: string[],
  satirlar: Hucre[][],
): void {
  const govde = [basliklar, ...satirlar]
    .map((satir) => satir.map(kacir).join(";"))
    .join("\r\n");
  const bom = "﻿";
  const blob = new Blob([bom + govde], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = dosyaAdi.toLowerCase().endsWith(".csv")
    ? dosyaAdi
    : `${dosyaAdi}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
