import type { Metadata } from "next";
import ProfileView from "@/app/components/profile-view";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage({ searchParams }: PageProps<"/konto/profil">) {
  const user = await requireUser();
  return <ProfileView user={user} back="/konto/profil" params={await searchParams} />;
}
