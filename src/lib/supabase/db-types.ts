// src/lib/supabase/db-types.ts

// Re-export dei generics generati: usali ovunque nel progetto
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  Json,
} from "./types";

// Porta Tables nello scope locale per creare alias comodi
import type { Tables } from "./types";

/**
 * Alias di tipo per righe (Row) delle tabelle / view che usi spesso.
 * Aggiungine altri seguendo lo stesso schema.
 *
 * Esempi d’uso:
 *   const rows: VAssignmentsPublic[] = await ...
 *   const one: Clients | null = ...
 */

// =============================
// ✅ Views (schema: public)
// =============================
export type VAssignmentsPublic = Tables<"v_assignments_public">;
export type VAreasPublic = Tables<"v_areas_public">;
export type VSeoPagesPublic = Tables<"v_seo_pages_public">;
export type VAdminAssignments = Tables<"v_admin_assignments">;
export type VAssignmentsGrouped = Tables<"v_assignments_grouped">;
export type VMacroAreasStats = Tables<"v_macro_areas_stats">;

// =============================
// ✅ Tables (schema: public)
// =============================
export type Clients = Tables<"clients">;
export type Assignments = Tables<"assignments">;
export type Areas = Tables<"areas">;
export type AreasCatalog = Tables<"areas_catalog">;
export type Cities = Tables<"cities">;
export type Leads = Tables<"leads">;
export type MacroAreas = Tables<"macro_areas">;
export type Orders = Tables<"orders">;
export type SeoPages = Tables<"seo_pages">;
export type ServicesRef = Tables<"services_ref">;

// =============================
// ⚙️ Storage (schema: storage) — opzionale
// =============================
// Lo schema “storage” non è incluso nei tipi generati di default.
// Se vuoi tipizzarlo in futuro, rigenera i tipi con:
//   supabase gen types typescript --project-id <id> --schema storage > src/lib/supabase/types.ts
// Per ora li lasciamo come `unknown` per evitare errori di compilazione.

export type StorageBuckets = unknown;
export type StorageObjects = unknown;
