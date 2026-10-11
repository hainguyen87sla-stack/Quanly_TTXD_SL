import { checkLocalRequest,errorResponse,json,readJson,rateLimit,ApiError,COOKIE_NAME } from '@/lib/security';
import { verifyAccessCode,createSession } from '@/lib/store';
export const runtime='nodejs';
export async function POST(request:Request) {try{checkLocalRequest(request,true);rateLimit('login:local',10,15*60_000);const input=await readJson(request) as {accessCode?:unknown};if(!input||typeof input.accessCode!=='string'||input.accessCode.length>200||!verifyAccessCode(input.accessCode.trim()))throw new ApiError(401,'Mã truy cập không đúng.');const session=createSession();return json({authenticated:true,mode:'local',csrfToken:session.csrf},200,{'Set-Cookie':`${COOKIE_NAME}=${session.token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`});}catch(e){return errorResponse(e);}}
