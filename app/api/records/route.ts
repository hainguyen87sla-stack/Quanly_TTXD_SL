import { requireSession,errorResponse,json } from '@/lib/security';
import { listRecords } from '@/lib/store';
export const runtime='nodejs';
export async function GET(request:Request) {try{requireSession(request);return json(listRecords());}catch(e){return errorResponse(e);}}
