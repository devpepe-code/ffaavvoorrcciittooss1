import { redirect } from 'next/navigation';

export default function BuscarRedirectPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const params = new URLSearchParams(searchParams).toString();
  redirect(`/buscar-servicios${params ? `?${params}` : ''}`);
}
