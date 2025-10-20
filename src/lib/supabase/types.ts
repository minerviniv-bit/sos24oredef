// src/lib/supabase/types.ts
// Tipi ufficiali derivati dallo schema che mi hai fornito.
// Nessuna deduzione: sono 1:1 con le definizioni viste in Supabase.

// ========== TABLES ==========

// public.assignments
export type AssignmentRow = {
  id: string;            // uuid
  service: string;       // text
  city: string;          // text
  area_slug: string;     // text
  client_id: string | null; // uuid | null
};

// public.clients
export type ClientRow = {
  id: string;
  name: string | null;
  company_name: string | null;
  vat_id: string | null;
  tax_code: string | null;
  sdi_code: string | null;
  pec_email: string | null;
  billing_email: string | null;
  phone: string | null;
  billing_address: string | null;
  bank_name: string | null;
  iban: string | null;
  signer_name: string | null;
  logo_url: string | null;
  description: string | null; // check <= 800, default '' ma TS vede string|null
  active: boolean;
  created_at: string | null;  // timestamptz -> ISO string
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  rating: number | null;      // numeric
  anni_attivita: number | null; // int, 0..80
  servizi_offerti: string[] | null; // text[]
  orari: string | null;
  interventi: number | null;
  rate: Record<string, unknown> | null; // jsonb
};

// public.areas  (dalla query information_schema.columns)
export type AreaRow = {
  slug: string;               // text, NOT NULL
  label: string;              // text, NOT NULL
  city: string;               // text, NOT NULL
  macro_area_id: string;      // uuid, NOT NULL
  macro_slug: string | null;  // text, NULL
  macro_title: string | null; // text, NULL
  popular: boolean;           // boolean, NOT NULL, default false
};

// public.macro_areas
export type MacroAreaRow = {
  id: string;                // uuid, default gen_random_uuid()
  city: string;              // text, NOT NULL
  slug: string;              // text, NOT NULL
  title: string;             // text, NOT NULL
  description: string | null;// text, NULL
  sort_order: number;        // integer, NOT NULL (default 0)
};

// public.seo_pages (tabella SEO che hai incollato)
export type SeoPageRow = {
  id: string;                         // uuid
  scope: string;                      // text (es. 'area' | 'city')
  service: string;                    // text
  city: string;                       // text
  area_slug: string | null;           // text
  title: string;                      // text
  meta_description: string;           // text
  h1: string | null;                  // text
  body_html: string | null;           // text
  faqs: unknown | null;               // jsonb
  json_ld: unknown | null;            // jsonb
  updated_at: string | null;          // timestamptz
  client_id: string | null;           // uuid
  created_at: string;                 // timestamptz (NOT NULL default now())
  natural_key: string;                // text
  status: string;                     // text (default 'draft')
  model_used: string | null;          // text
  generated_at: string | null;        // timestamptz
  published_at: string | null;        // timestamptz
};

// public.services_ref (dalla tua schermata)
export type ServiceRefRow = {
  service: string; // text, NOT NULL
};


// ========== VIEWS ==========

// public.v_assignments_public (dalla definizione che mi hai mostrato)
export type VAssignmentsPublic = {
  id: string;                // a.id
  service: string;           // a.service
  city: string;              // a.city
  area_slug: string;         // a.area_slug
  area_label: string | null; // ar.label
  macro_slug: string | null; // ar.macro_slug
  macro_title: string | null;// ma.title
  sort_order: number | null; // ma.sort_order
  client_id: string | null;  // a.client_id
  client_name: string | null;// c.name
  logo_url: string | null;   // c.logo_url
  client_phone: string | null;     // c.phone
  client_whatsapp: string | null;  // c.whatsapp
  client_website: string | null;   // c.website
  client_rating: number | null;    // c.rating
};

// public.v_areas_public (dalla definizione che mi hai mostrato)
export type VAreasPublic = {
  area_slug: string;              // ar.slug
  area_label: string | null;      // ar.label
  city: string;                   // ar.city
  macro_slug: string | null;      // ar.macro_slug
  macro_title: string | null;     // ma.title
  sort_order: number | null;      // ma.sort_order
  macro_area_id: string | null;   // ma.id
};

// public.v_macro_areas_stats (dalla definizione che mi hai mostrato)
export type VMacroAreasStats = {
  city: string;         // ma.city
  slug: string;         // ma.slug
  title: string;        // ma.title
  sort_order: number | null; // ma.sort_order
  areas_count: number;       // count(ar.slug) -> bigint coerced a number
  popular: Array<{ area_slug: string | null; label: string | null }> | null; // json_agg(...)
};

// (Opzionale) public.v_assignments_grouped -> quando/SE mi dai la view completa, aggiungiamo qui.
// export type VAssignmentsGrouped = { ... };
