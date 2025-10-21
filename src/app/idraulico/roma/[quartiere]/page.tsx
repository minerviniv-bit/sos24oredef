// src/app/idraulico/roma/[quartiere]/page.tsx
import { buildQuartiereHandlers } from "@/app/_shared/quartierePage";
export const dynamic = "force-dynamic";

const h = buildQuartiereHandlers("idraulico");
export const generateMetadata = h.generateMetadata;
export default h.Page;
