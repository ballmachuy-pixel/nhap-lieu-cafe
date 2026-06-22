"use server";

import { supabase } from "@/lib/supabase";

export async function getDashboardData(startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase dashboard fetch error:", error);
      return { success: false, entries: [] };
    }

    return { success: true, entries: data };
  } catch (err) {
    console.error("Fetch Exception:", err);
    return { success: false, entries: [] };
  }
}
