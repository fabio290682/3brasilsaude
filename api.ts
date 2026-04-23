import type { Collection, Transfusion, Therapeutic, PaginatedResponse } from './types';
const BASE='/api';
async function req<T>(path:string,init?:RequestInit):Promise<T>{
  const key=import.meta.env.VITE_API_KEY;
  const headers:HeadersInit={'Content-Type':'application/json',...(key?{'x-api-key':key}:{}),...init?.headers};
  const r=await fetch(`${BASE}${path}`,{...init,headers});
  if(!r.ok){const e=await r.json().catch(()=>({message:r.statusText}));throw new Error(e.message??'Request failed');}
  return r.json();
}
export const collectionsApi={
  list:(p?:Record<string,string>)=>req<PaginatedResponse<Collection>>(`/collections?${new URLSearchParams(p)}`),
  get:(id:string)=>req<Collection>(`/collections/${id}`),
  create:(b:Partial<Collection>)=>req<Collection>('/collections',{method:'POST',body:JSON.stringify(b)}),
  update:(id:string,b:Partial<Collection>)=>req<Collection>(`/collections/${id}`,{method:'PATCH',body:JSON.stringify(b)}),
  remove:(id:string)=>req<{message:string}>(`/collections/${id}`,{method:'DELETE'}),
};
export const transfusionsApi={
  list:(p?:Record<string,string>)=>req<PaginatedResponse<Transfusion>>(`/transfusions?${new URLSearchParams(p)}`),
  get:(id:string)=>req<Transfusion>(`/transfusions/${id}`),
  create:(b:Partial<Transfusion>)=>req<Transfusion>('/transfusions',{method:'POST',body:JSON.stringify(b)}),
  approve:(id:string,bagCode:string,approvedBy:string)=>req<Transfusion>(`/transfusions/${id}/approve`,{method:'POST',body:JSON.stringify({bagCode,approvedBy})}),
  update:(id:string,b:Partial<Transfusion>)=>req<Transfusion>(`/transfusions/${id}`,{method:'PATCH',body:JSON.stringify(b)}),
  remove:(id:string)=>req<{message:string}>(`/transfusions/${id}`,{method:'DELETE'}),
};
export const therapeuticApi={
  list:(p?:Record<string,string>)=>req<PaginatedResponse<Therapeutic>>(`/therapeutic?${new URLSearchParams(p)}`),
  get:(id:string)=>req<Therapeutic>(`/therapeutic/${id}`),
  create:(b:Partial<Therapeutic>)=>req<Therapeutic>('/therapeutic',{method:'POST',body:JSON.stringify(b)}),
  update:(id:string,b:Partial<Therapeutic>)=>req<Therapeutic>(`/therapeutic/${id}`,{method:'PATCH',body:JSON.stringify(b)}),
  remove:(id:string)=>req<{message:string}>(`/therapeutic/${id}`,{method:'DELETE'}),
};
export const healthApi={check:()=>req<{status:string;db:string;uptime:number}>('/health')};
