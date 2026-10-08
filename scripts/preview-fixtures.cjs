/* Integration/visual check of the real Calagopus frontend with intercepted local fixtures.
 * Run against Vite preview, not against a deployed panel. No API writes leave this browser.
 */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { decode } = require(path.resolve(process.env.CALAGOPUS_ROOT || path.resolve(__dirname, '../../..'), 'frontend/node_modules/@msgpack/msgpack'));
const base = process.env.THEME_PREVIEW_URL || 'http://127.0.0.1:4173';
const fixture = JSON.parse(fs.readFileSync(process.argv[2] || '/tmp/hydrodactyl-fixtures.json'));
const output = process.argv[3] || '/tmp/hydrodactyl-previews';
fs.mkdirSync(output, { recursive: true });
const pag = (data=[]) => ({ total: data.length, per_page: 50, page: 1, data });
const requests = new Set();
const failures = [];
const results = [];
async function mock(context, authenticated=true, enabled=true, readOnly=false, emptyResources=false) {
 // Vite's /assets proxy normally points at Rust; serve the production build locally.
 await context.route('**/assets/**', async route => {
  const name = decodeURIComponent(new URL(route.request().url()).pathname).slice('/assets/'.length);
  const assets = path.resolve(process.env.CALAGOPUS_ROOT || path.resolve(__dirname, '../../..'), 'frontend/dist/assets');
  const file = path.resolve(assets, name);
  if (!file.startsWith(assets + path.sep) || !fs.existsSync(file)) return route.fulfill({status:404});
  const ext = path.extname(file);
  const contentType = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : ext === '.woff2' ? 'font/woff2' : 'application/octet-stream';
  await route.fulfill({contentType,body:fs.readFileSync(file)});
 });
 await context.route('**/api/**', async route => {
  const u=new URL(route.request().url()), p=u.pathname;
  requests.add(p);
  let data={}; let status=200;
  if(p==='/api/settings')data={...fixture.settings,disabled_extensions:enabled?[]:['com.luxxy.hydrodactyl'],time:new Date().toISOString(),app:{...fixture.settings.app,url:base}};

  else if(p==='/api/admin/system/overview')data={version:'1.2.4',container_type:'official_heavy',architecture:'x86_64',kernel_version:'6.12.107',cpu:{name:'CPU',brand:'AMD Ryzen 9 7950X 16-Core Processor',vendor_id:'AMD',frequency_mhz:4500,cpu_count:16},memory:{total_bytes:17179869184,free_bytes:12079595520,used_bytes:5100273664,used_bytes_process:85228257},cache:{version:'9.1.2',total_calls:78,total_hits:48,total_misses:20,average_hit_latency_ns:81910000,average_miss_latency_ns:121900000,max_call_latency_ns:166960000,local_hits:{calls:48,average_latency_ns:81910000},remote_hits:{calls:0,average_latency_ns:0},coalesced_waits:{calls:0,average_latency_ns:0}},database:{version:'PostgreSQL 18.6',size_bytes:154560921,total_read_connections:5,idle_read_connections:4,total_write_connections:5,idle_write_connections:4}};
  else if(p==='/api/admin/stats/general')data={stats:{users:5,servers:4,locations:1,nodes:1,nest_eggs:2,database_hosts:0,backup_configurations:1,roles:0}};
  else if(p==='/api/admin/stats/backups'){const empty={total:0,successful:0,successful_bytes:0,failed:0,deleted:0,deleted_bytes:0};const used={...empty,total:2,successful:2,successful_bytes:473320652};data={all_time:used,today:empty,week:empty,month:used};}
  else if(p==='/api/languages')data={languages:['en']};
  else if(p==='/api/announcements'||p.endsWith('/announcements'))data={announcements:[]};
  else if(p==='/api/client/account'){ data={user:fixture.user};if(!authenticated)status=401; }
  else if(p.endsWith('/settings'))data={settings:{}};
  else if(p.endsWith('/permissions'))data={admin_permissions:{},user_permissions:{},server_permissions:{}};
  else if(p==='/api/client/servers')data={servers:pag([fixture.server])};
  else if(p==='/api/client/servers/groups')data={server_groups:[]};
  else if(/^\/api\/client\/servers\/[^/]+$/.test(p))data={server:readOnly?{...fixture.server,is_owner:false,permissions:['databases.read']}:fixture.server};
  else if(p.endsWith('/websocket'))data={token:'fixture-only',url:base.replace('http','ws')+'/theme-visual-socket'};
  else if(p.endsWith('/databases/instances/templates'))data={templates:[],database_instance_templates:[]};
  else if(p.endsWith('/databases/instances'))data={database_instances:pag()};
  else if(p.endsWith('/databases/hosts'))data={database_hosts:[{uuid:fixture.server.uuid,name:'Local MySQL',host:'127.0.0.1',port:3306,type:'mysql',maintenance_enabled:false}]};
  else if(p.endsWith('/databases'))data={databases:pag([fixture.database])};
  else if(p.endsWith('/size'))data={size:1024};
  else if(p.endsWith('/allocations'))data={allocations:pag([fixture.allocation])};
  else if(p.endsWith('/subusers'))data={subusers:pag(emptyResources?[]:[fixture.subuser])};
  else if(p.endsWith('/schedules'))data={schedules:pag([fixture.schedule])};
  else if(p.endsWith('/backups/groups'))data={backup_groups:[]};
  else if(p.endsWith('/backups/usage'))data={usage:{count:1,bytes:33554432}};
  else if(p.endsWith('/backups'))data={backups:pag(emptyResources?[]:[fixture.backup])};
  else if(p.endsWith('/startup/variables'))data={variables:[fixture.variable]};
  else if(p.endsWith('/files/list'))data={is_filesystem_primary:true,is_filesystem_writable:true,is_filesystem_fast:true,entries:pag(u.searchParams.get('directory')==='/txData'?[{...fixture.files[0],name:'default',size:74752},{...fixture.files[1],name:'BasicServerEnhanced_B84E16.base',directory:true,file:false,mime:'inode/directory',size:34889482},{...fixture.files[2],name:'admins.json',size:445}]:fixture.files),uploads:[]};
  else if(p.endsWith('/files/operations'))data={operations:[]};
  else if(p.endsWith('/api-keys'))data={api_keys:pag([fixture.apiKey])};
  else if(p.endsWith('/ssh-keys'))data={ssh_keys:pag([fixture.sshKey])};
  else if(p.includes('/servers/eggs/')&&p.endsWith('/command-snippets'))data={command_snippets:[]};
  else if(p.endsWith('/command-snippets'))data={command_snippets:pag()};
  else if(p.endsWith('/activity'))data={activities:pag()};
  else if(p.endsWith('/nodes'))data={nodes:[]};
  else if(p.endsWith('/groups'))data={server_groups:[]};
  else if(p.endsWith('/oauth'))data={oauth_providers:[]};
  else if(p.endsWith('/security-keys'))data={security_keys:[]};
  else data={nodes:[],groups:[],providers:[],security_keys:[],uploads:[],operations:[],connections:pag(),firewall_rules:pag(),mounts:pag(),devices:pag(),sessions:pag(),oauth_links:pag()};
  await route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
 });
 await context.routeWebSocket('**/theme-visual-socket*', ws => {
  const send=(event,args=[])=>ws.send(JSON.stringify({event,args}));
  ws.onMessage(raw=> {
   let msg;try{msg=typeof raw==='string'?JSON.parse(raw):decode(raw);}catch{return;}
   if(Array.isArray(msg))msg={event:msg[0],args:msg[1]};
   if(msg.event==='auth'){send('auth success');send('status',['offline']);}
   if(msg.event==='send stats')send('stats',[JSON.stringify({cpu_absolute:0,memory_bytes:0,disk_bytes:61,uptime:0,network:{rx_bytes:0,tx_bytes:0}})]);
   if(msg.event==='send logs')send('console output',['\u001b[33mcontainer@hydrodactyl~\u001b[0m Server marked as offline...']);
   if(msg.event==='ping')send('pong');
  });
 });
}

module.exports = { mock, fixture, base, chromium, fs, path };
