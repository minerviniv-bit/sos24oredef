import { buildQuartiereHandlers } from "@/app/_shared/quartierePage";
export const dynamic = "force-dynamic";

const h = buildQuartiereHandlers("fabbro");
export const generateMetadata = h.generateMetadata;
export default h.Page;
