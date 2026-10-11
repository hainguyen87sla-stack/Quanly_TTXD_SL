import { z } from 'zod';
import { ApiError } from './security';
import { resolveCommune } from './geo-server';
import type { PermitInput, ReportInput } from './types';
const text=(max:number,min=1)=>z.string().trim().min(min,'Vui lòng nhập thông tin.').max(max,'Nội dung quá dài.').refine(s=>Array.from(s).every(c=>c.charCodeAt(0)>=32||[9,10,13].includes(c.charCodeAt(0))),'Nội dung chứa ký tự không hợp lệ.');
const location={address:text(500),communeCode:text(20),lat:z.number().finite().min(-90).max(90),lng:z.number().finite().min(-180).max(180)};
const date=text(10).regex(/^\d{4}-\d{2}-\d{2}$/,'Ngày không hợp lệ.').refine(v=>{const d=new Date(v+'T00:00:00Z');return !isNaN(d.getTime())&&d.toISOString().slice(0,10)===v&&v>='1900-01-01'&&v<=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Ho_Chi_Minh'});},'Ngày cấp phải có thật và không ở tương lai.');
export const permitSchema=z.object({...location,permitNumber:text(100),issueDate:date,issuingAuthority:text(200),investorName:text(200),projectName:text(300),area:z.number().finite().positive().max(100_000_000),floors:z.number().int().min(1).max(200),constructionType:z.enum(['new','renovation']),notes:text(3000,0)}).strict();
export const reportSchema=z.object({...location,title:text(200),content:text(5000,10),category:z.enum(['unlicensed','wrong_permit','safety','other']),reporterName:text(200,0),reporterPhone:text(30,0).refine(v=>!v||/^\+?[0-9 ()\-.]{7,30}$/.test(v),'Số điện thoại không hợp lệ.')}).strict();
function parse<T>(schema:z.ZodType<T>,input:unknown):T {
  const result=schema.safeParse(input);if(!result.success){const fields:Record<string,string>={};for(const issue of result.error.issues) fields[issue.path.join('.')||'form']=issue.message;throw new ApiError(422,'Vui lòng kiểm tra các trường nhập.',fields);}
  const point=result.data as T & {lat:number;lng:number;communeCode:string};const commune=resolveCommune({lat:point.lat,lng:point.lng});
  if(!commune) throw new ApiError(422,'Vị trí nằm ngoài ranh giới Sơn La hoặc chưa xác định được địa bàn.',{communeCode:'Hãy chọn vị trí bên trong ranh giới xã/phường.'});
  if(commune.code!==point.communeCode) throw new ApiError(422,'Vị trí không thuộc xã/phường đã chọn.',{communeCode:`Vị trí thuộc ${commune.name}.`});return result.data;
}
export const validatePermit=(input:unknown):PermitInput=>parse(permitSchema,input);
export const validateReport=(input:unknown):ReportInput=>parse(reportSchema,input);
