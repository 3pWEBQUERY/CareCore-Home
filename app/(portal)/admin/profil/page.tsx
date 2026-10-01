import type { Metadata } from "next";
import ProfileView from "@/app/components/profile-view";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Profil" };

export default async function AdminProfilePage({ searchParams }: PageProps<"/admin/profil">) {
  const user = await requireAdmin();
  return <ProfileView user={user} back="/admin/profil" params={await searchParams} />;
}
