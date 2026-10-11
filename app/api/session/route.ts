import { checkLocalRequest,errorResponse,json,sessionToken } from '@/lib/security';
import { findSession,verifyAccessCode } from '@/lib/store';
export const runtime='nodejs';
export async function GET(request:Request) {try{checkLocalRequest(request);verifyAccessCode('');const token=sessionToken(request),session=token?findSession(token):undefined;return json({authenticated:!!session,mode:'local',...(session?{csrfToken:session.csrf}:{})});}catch(e){return errorResponse(e);}}
