import { KayitDetayIcerik } from "@/components/kayit-detay/kayit-detay-icerik";

export default async function KayitDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <KayitDetayIcerik id={id} />;
}
