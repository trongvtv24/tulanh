"use client";

import { PersonalJournal } from "@/components/journal/PersonalJournal";
import { LandingPage } from "@/components/landing/LandingPage";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export default function Home() {
  const { user, loading } = useSupabaseAuth();

  if (loading) return null;

  if (!user) {
    return <LandingPage />;
  }

  return <PersonalJournal />;
}
