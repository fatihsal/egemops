// Kullanılan Solar / vscode-icons ikonlarını çevrimdışı (yerel veriden) kaydeder.
// Böylece Iconify çalışma anında api.iconify.design'a istek atmaz; ikonlar
// her ağda ve anında görünür. Veri `scripts/extract-icons.mjs` ile üretilir.
"use client";

import { addCollection, type IconifyJSON } from "@iconify/react";

import koleksiyonlar from "@/lib/icon-collections.json";

(koleksiyonlar as unknown as IconifyJSON[]).forEach((k) => addCollection(k));
