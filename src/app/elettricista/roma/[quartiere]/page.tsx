import { buildQuartiereHandlers } from "@/app/_shared/quartierePage";
export const dynamic = "force-dynamic";

const h = buildQuartiereHandlers("elettricista");
export const generateMetadata = h.generateMetadata;
export default h.Page;
