import { requireSession,errorResponse,json,sessionToken,COOKIE_NAME } from '@/lib/security';
import { deleteSession } from '@/lib/store';
export const runtime='nodejs';
export async function POST(request:Request) {try{requireSession(request,true);deleteSession(sessionToken(request));return json({authenticated:false,mode:'local'},200,{'Set-Cookie':`${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`});}catch(e){return errorResponse(e);}}
