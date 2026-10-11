import { requireSession,errorResponse,json,readJson } from '@/lib/security';
import { insertReport } from '@/lib/store';
import { validateReport } from '@/lib/validation';
export const runtime='nodejs';
export async function POST(request:Request) {try{requireSession(request,true);return json(insertReport(validateReport(await readJson(request))),201);}catch(e){return errorResponse(e);}}
