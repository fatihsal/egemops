"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RaporOlusturForm } from "@/components/raporlar/rapor-olustur-form";

export function RaporOlustur() {
  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Rapor Oluştur</h3>
      </CardHeader>
      <CardContent>
        <RaporOlusturForm />
      </CardContent>
    </Card>
  );
}
