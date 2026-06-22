"use server";

import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function loginWithPin(pin: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("pin", pin)
      .single();

    if (error || !data) {
      return { success: false, message: `Mã PIN không đúng (Lỗi: ${error?.message || "Không tìm thấy user"})` };
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("session_role", data.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    
    cookieStore.set("session_name", data.name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return { success: true, role: data.role };
  } catch (err) {
    return { success: false, message: "Lỗi hệ thống" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session_role");
  cookieStore.delete("session_name");
}

export async function getSession() {
  const cookieStore = await cookies();
  const role = cookieStore.get("session_role")?.value;
  const name = cookieStore.get("session_name")?.value;
  return { role, name };
}
