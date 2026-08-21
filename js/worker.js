const ALLOWED_USERNAME="masudjimch";
const EDITOR_URL="https://masudjimch.github.io/masud-portfolio/editor/";
const CALLBACK_URL="https://masud-portfolio-auth.masudj16.workers.dev/callback";
const REPO_OWNER="masudjimch";
const REPO_NAME="masud-portfolio";
const FILE_PATH="data/portfolio.json";
const sessions=new Map();

function b64(s){return btoa(unescape(encodeURIComponent(s)))}
function cors(){return {"Access-Control-Allow-Origin":"https://masudjimch.github.io","Access-Control-Allow-Headers":"Authorization, Content-Type","Access-Control-Allow-Methods":"GET, POST, OPTIONS"}}
function json(x,status=200){return new Response(JSON.stringify(x),{status,headers:{"Content-Type":"application/json",...cors()}})}
function bearer(req){const h=req.headers.get("Authorization")||"";return h.startsWith("Bearer ")?h.slice(7):null}

export default {async fetch(request,env){
 const url=new URL(request.url);
 if(request.method==="OPTIONS")return new Response(null,{headers:cors()});

 if(url.pathname==="/login"){
   const a=new URL("https://github.com/login/oauth/authorize");
   a.searchParams.set("client_id",env.GITHUB_CLIENT_ID);
   a.searchParams.set("redirect_uri",CALLBACK_URL);
   a.searchParams.set("scope","repo read:user");
   return Response.redirect(a.toString(),302);
 }

 if(url.pathname==="/callback"){
   const code=url.searchParams.get("code");
   if(!code)return new Response("Login failed.",{status:400});
   const tr=await fetch("https://github.com/login/oauth/access_token",{method:"POST",headers:{"Accept":"application/json","Content-Type":"application/json"},body:JSON.stringify({client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code,redirect_uri:CALLBACK_URL})});
   const td=await tr.json();
   if(!td.access_token)return new Response("Could not obtain GitHub access token.",{status:401});
   const ur=await fetch("https://api.github.com/user",{headers:{Authorization:`Bearer ${td.access_token}`,"User-Agent":"Masud-Portfolio-Admin"}});
   const user=await ur.json();
   if(!user.login||user.login.toLowerCase()!==ALLOWED_USERNAME)return new Response("Access denied.",{status:403});
   const session=crypto.randomUUID()+"-"+crypto.randomUUID();
   sessions.set(session,{token:td.access_token,expires:Date.now()+30*60*1000});
   return Response.redirect(EDITOR_URL+"#session="+encodeURIComponent(session),302);
 }

 if(url.pathname==="/session"){
   const s=sessions.get(bearer(request));
   if(!s||s.expires<Date.now())return json({error:"Invalid session"},401);
   return json({ok:true});
 }

 if(url.pathname==="/save"&&request.method==="POST"){
   const s=sessions.get(bearer(request));
   if(!s||s.expires<Date.now())return json({error:"Invalid session"},401);
   const body=await request.json();
   if(!body.content)return json({error:"Missing content"},400);
   const api=`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
   const current=await fetch(api,{headers:{Authorization:`Bearer ${s.token}`,Accept:"application/vnd.github+json","User-Agent":"Masud-Portfolio-Admin"}});
   if(!current.ok)return json({error:"Could not read current GitHub file"},500);
   const old=await current.json();
   const put=await fetch(api,{method:"PUT",headers:{Authorization:`Bearer ${s.token}`,Accept:"application/vnd.github+json","Content-Type":"application/json","User-Agent":"Masud-Portfolio-Admin"},body:JSON.stringify({message:"Update portfolio via admin editor",content:b64(JSON.stringify(body.content,null,2)),sha:old.sha,branch:"main"})});
   const result=await put.json();
   if(!put.ok)return json({error:result.message||"GitHub save failed"},500);
   return json({ok:true});
 }

 return new Response(`<!doctype html><html><body style="font-family:system-ui;display:grid;place-items:center;min-height:100vh"><main style="text-align:center"><h1>Portfolio Admin</h1><p>Private editor access.</p><a href="/login">Sign in with GitHub</a></main></body></html>`,{headers:{"Content-Type":"text/html"}});
}};