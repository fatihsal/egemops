import { TalepDetay } from "@/components/satinalma/talepler/talep-detay";

export default async function TalepDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TalepDetay id={id} />;
}
