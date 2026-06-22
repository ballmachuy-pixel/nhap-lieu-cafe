"use server";

import { supabase } from "@/lib/supabase";

export type SearchItemResult = {
  name: string;
  unit: string | null;
  amount: number | null;
};

export type SearchSupplierResult = {
  supplier: string;
};

export async function searchItems(term: string): Promise<SearchItemResult[]> {
  if (!term || term.trim() === "") return [];

  const { data, error } = await supabase.rpc("search_recent_items", {
    search_term: term.trim(),
  });

  if (error) {
    console.error("Error searching items:", error);
    return [];
  }

  return data as SearchItemResult[];
}

export async function searchSuppliers(term: string): Promise<SearchSupplierResult[]> {
  if (!term || term.trim() === "") return [];

  const { data, error } = await supabase.rpc("search_recent_suppliers", {
    search_term: term.trim(),
  });

  if (error) {
    console.error("Error searching suppliers:", error);
    return [];
  }

  return data as SearchSupplierResult[];
}
