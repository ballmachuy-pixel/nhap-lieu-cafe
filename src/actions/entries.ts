"use server";

import { supabase } from "@/lib/supabase";

export type CreateEntryPayload = {
  date: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  supplier: string | null;
  amount: number;
  method: "CASH" | "TRANSFER";
  note: string | null;
  created_by: string;
};

export async function createEntry(payload: CreateEntryPayload) {
  try {
    const { error } = await supabase.from("entries").insert([
      {
        date: payload.date,
        name: payload.name.trim(),
        quantity: payload.quantity,
        unit: payload.unit?.trim() || null,
        supplier: payload.supplier?.trim() || null,
        amount: payload.amount,
        method: payload.method,
        note: payload.note?.trim() || null,
        created_by: payload.created_by,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Server Action Exception:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}

export type EntryRow = {
  id: string;
  date: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  supplier: string | null;
  amount: number;
  method: "CASH" | "TRANSFER";
  note: string | null;
  created_by: string;
  created_at: string;
};

export async function getRecentEntries(filterDate?: string): Promise<EntryRow[]> {
  try {
    let query = supabase.from("entries").select("*");
    
    if (filterDate) {
      query = query.eq("date", filterDate);
    }
    
    const { data, error } = await query
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Supabase fetch error:", error);
      return [];
    }

    return data as EntryRow[];
  } catch (err) {
    console.error("Fetch Exception:", err);
    return [];
  }
}

export async function correctEntry(oldEntry: EntryRow, newPayload: CreateEntryPayload) {
  try {
    const cancelNote = oldEntry.note ? `[HỦY PHIẾU CŨ] ${oldEntry.note}` : "[HỦY PHIẾU CŨ]";
    
    const cancelEntry = {
      date: oldEntry.date,
      name: oldEntry.name,
      quantity: oldEntry.quantity,
      unit: oldEntry.unit,
      supplier: oldEntry.supplier,
      amount: -oldEntry.amount, // Âm số tiền
      method: oldEntry.method,
      note: cancelNote,
      created_by: newPayload.created_by, // Người thực hiện việc hủy
    };

    const newEntry = {
      date: newPayload.date,
      name: newPayload.name.trim(),
      quantity: newPayload.quantity,
      unit: newPayload.unit?.trim() || null,
      supplier: newPayload.supplier?.trim() || null,
      amount: newPayload.amount,
      method: newPayload.method,
      note: newPayload.note?.trim() || null,
      created_by: newPayload.created_by,
    };

    const { error } = await supabase.from("entries").insert([cancelEntry, newEntry]);

    if (error) {
      console.error("Supabase insert correction error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Correction Exception:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}

export async function getDailySummary(dateStr: string) {
  try {
    const { data, error } = await supabase
      .from("entries")
      .select("amount, method")
      .eq("date", dateStr);

    if (error) {
      console.error("Supabase daily summary error:", error);
      return { total: 0, cash: 0, transfer: 0 };
    }

    let total = 0;
    let cash = 0;
    let transfer = 0;

    for (const row of data) {
      total += row.amount;
      if (row.method === "CASH") cash += row.amount;
      if (row.method === "TRANSFER") transfer += row.amount;
    }

    return { total, cash, transfer };
  } catch (err) {
    console.error("Daily summary exception:", err);
    return { total: 0, cash: 0, transfer: 0 };
  }
}
