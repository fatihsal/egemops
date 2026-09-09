// İstemci tarafı CSV dışa aktarma. Excel'in Türkçe yerelinde varsayılan ayraç
// noktalı virgül (;) olduğu ve Türkçe karakterlerin bozulmaması için başa UTF-8
// BOM eklenir. Blob + <a download> ile gerçek dosya indirilir.

type Hucre = string | number | null | undefined;

function kacir(deger: Hucre): string {
  const s = String(deger ?? "");
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
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
