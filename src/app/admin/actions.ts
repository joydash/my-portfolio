"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/auth";

/** Called by the dashboard after every successful save so public pages update immediately. */
export async function revalidatePublic(): Promise<{ ok: boolean }> {
  if (!(await getAdminUser())) return { ok: false };
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
  return { ok: true };
}
