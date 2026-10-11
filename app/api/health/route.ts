import { checkLocalRequest,errorResponse,json } from '@/lib/security';
export const runtime='nodejs';
export async function GET(request:Request) {try{checkLocalRequest(request);return json({ok:true,mode:'local'});}catch(e){return errorResponse(e);}}
