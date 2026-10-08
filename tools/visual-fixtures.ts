/* Synthetic local fixtures; never creates users, servers, or data on a real panel. */
import { writeFileSync } from 'node:fs';
import { publicSettingsSchema as Settings } from '../../../frontend/src/lib/schemas/settings.ts';
import { fullUserSchema as User, userSchema as SummaryUser } from '../../../frontend/src/lib/schemas/user.ts';
import { serverSchema as Server } from '../../../frontend/src/lib/schemas/server/server.ts';
import { serverAllocationSchema as Allocation } from '../../../frontend/src/lib/schemas/server/allocations.ts';
import { serverDatabaseSchema as Database } from '../../../frontend/src/lib/schemas/server/databases.ts';
import { serverDirectoryEntrySchema as File } from '../../../frontend/src/lib/schemas/server/files.ts';
import { serverBackupSchema as Backup } from '../../../frontend/src/lib/schemas/server/backups.ts';
import { serverScheduleSchema as Schedule } from '../../../frontend/src/lib/schemas/server/schedules.ts';
import { serverSubuserSchema as Subuser } from '../../../frontend/src/lib/schemas/server/subusers.ts';
import { serverVariableSchema as Variable } from '../../../frontend/src/lib/schemas/server/startup.ts';
import { userApiKeySchema as ApiKey } from '../../../frontend/src/lib/schemas/user/apiKeys.ts';
import { userSshKeySchema as SshKey } from '../../../frontend/src/lib/schemas/user/sshKeys.ts';
import { serializeForApi } from '../../../frontend/src/lib/serialization/api-transform.ts';
const now = new Date('2026-10-06T12:00:00Z');
const uuid = '00000000-0000-4000-8000-000000000001';
function seed(schema: any): any {
 const d=schema._zod.def;
 switch(d.type) {
 case 'lazy':return seed(d.getter()); case 'pipe':return seed(d.in);
 case 'object':return Object.fromEntries(Object.entries(d.shape).map(([k,v])=>[k,seed(v)]));
 case 'string':return 'fixture'; case 'number':return 10; case 'boolean':return false; case 'date':return now;
 case 'array':return []; case 'record':return {}; case 'enum':return Object.values(d.entries)[0];
 case 'literal':return d.values[0]; case 'nullable':return null; case 'optional':return undefined;
 case 'union':return seed(d.options[0]); case 'default':return seed(d.innerType); default:return null;
 }
}
function model(schema: any, overrides: any) { return schema.parse({...seed(schema),...overrides}); }
const allocation=model(Allocation,{uuid,ip:'0.0.0.0',port:25565,isPrimary:true});
const models: Record<string,[any,any]>={
 settings:[Settings,{time:now.toISOString(),app:{...seed(Settings.shape.app),url:'http://127.0.0.1:5173',name:'Hydrodactyl',language:'en',passwordLoginEnabled:true},captchaProvider:{type:'none'},server:{...seed(Settings.shape.server),containerPrelude:'container@hydrodactyl~'}}],
 user:[User,{uuid,username:'dev',email:'dev@hydrodactyl.dev',admin:true,language:'en',hasPassword:true,emailVerified:true,twoFactorSatisfied:true}],
 server:[Server,{uuid,uuidShort:'00000001',name:'dev',isOwner:true,permissions:['*'],sftpHost:'127.0.0.1',sftpPort:2022,startup:'java -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}',image:'java:21',allocation,nodeUuid:uuid,nodeName:'Local node',locationUuid:uuid,locationName:'Local',egg:{...seed(Server.shape.egg),uuid,name:'Minecraft',startupCommands:{Default:'java -jar server.jar'},dockerImages:{'Java 21':'java:21'}},limits:{cpu:100,memory:1024,swap:0,disk:10240},eggConfiguration:{allocationSelfAssignEnabled:true,allocationSelfAssignRequirePrimary:true,startupAllowCustomCommand:true,routeOrder:null}}],
 allocation:[Allocation,allocation], database:[Database,{uuid,name:'s1_minecraft',username:'u1_dev',host:'127.0.0.1',port:3306,type:'mysql',password:'fixture-only'}],
 backup:[Backup,{uuid,name:'Daily Backup',isSuccessful:true,isLocked:false,checksum:'sha256:bd90a36d4f63cb9ed51c432d',bytes:33554432,completed:now}],
 schedule:[Schedule,{uuid,name:'Daily restart',enabled:true,triggers:[{type:'cron',schedule:'0 4 * * *'}]}],
 subuser:[Subuser,{user:model(SummaryUser,{uuid:'00000000-0000-4000-8000-000000000002',username:'teammate',totpEnabled:true}),permissions:['control.start','control.stop','files.read']}],
 variable:[Variable,{name:'Server Jar File',envVariable:'SERVER_JARFILE',description:'The name of the jar file to run.',defaultValue:'server.jar',value:'server.jar',isEditable:true,rules:['required','string']}],
 apiKey:[ApiKey,{uuid,name:'Development',keyStart:'c7s_fixture',enabled:true}], sshKey:[SshKey,{uuid,name:'Workstation',fingerprint:'SHA256:fixture123456789'}],
};
const out=Object.fromEntries(Object.entries(models).map(([key,[schema,data]])=>[key,serializeForApi(schema,model(schema,data))]));
out.files=['plugins','server.jar','server.properties','latest.log'].map((name,i)=>serializeForApi(File,model(File,{name,mode:'rw-r--r--',modeBits:'0644',size:i?2048:0,sizePhysical:2048,editable:i>1,innerEditable:true,directory:i===0,file:i>0,mime:i===1?'application/java-archive':'text/plain'})));
writeFileSync(process.argv[2]??'/tmp/hydrodactyl-fixtures.json',JSON.stringify(out,null,2));
