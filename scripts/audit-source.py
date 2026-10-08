#!/usr/bin/env python3
"""Read every reference script and record its actual Calagopus adaptation boundary."""
import hashlib
import json
import os
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

reference = Path(sys.argv[1] if len(sys.argv) > 1 else '/workspace/hydrodactyl-reference')
extension = Path(__file__).resolve().parents[1]
panel = Path(os.environ.get('CALAGOPUS_ROOT', str(extension.parents[1])))
revision = subprocess.check_output(['git', '-C', str(reference), 'rev-parse', 'HEAD'], text=True).strip()
src = reference / 'resources/scripts'
E = 'backend-extensions/com_luxxy_hydrodactyl/frontend/src/'
C = 'frontend/src/'
# Destinations are code that is used by the theme, rather than a directory of unused upstream files.
ports = [
 ('components/layout/header/UserDropdown', ['UserDropdown.tsx']),
 ('components/layout/header/', ['Sidebar.tsx', 'ServerHeader.tsx']),
 ('components/layout/', ['Sidebar.tsx', 'NavIcon.tsx', 'app.css']),
 ('contexts/HeaderContext', ['headerSlots.ts']),
 ('contexts/SidebarContext', ['preferences.ts', 'Sidebar.tsx']),
 ('components/HeaderManger', ['headerSlots.ts', 'PageLayout.tsx']),
 ('components/elements/HydroLogo', ['Logo.tsx']),
 ('components/elements/TitledGreyBox', ['TitledGreyBox.tsx']),
 ('components/elements/VirtualizedList', ['ResourceList.tsx']),
 ('components/elements/ScreenBlock', ['Feedback.tsx']),
 ('components/elements/PageContentBlock', ['PageLayout.tsx']),
 ('components/elements/ServerContentBlock', ['PageLayout.tsx']),
 ('components/elements/ItemContainer', ['ResourceList.tsx', 'app.css']),
 ('components/elements/activity/', ['ActivityList.tsx', 'pages/ActivityRow.tsx', 'app.css']),
 ('components/server/header/', ['ServerHeader.tsx', 'PowerButtons.tsx', 'Sidebar.tsx']),
 ('components/server/console/PowerButtons', ['PowerButtons.tsx']),
 ('components/server/console/chart.', ['chart.ts']),
 ('components/server/UptimeDuration', ['UptimeDuration.ts']),
 ('components/server/console/', ['ServerConsole.tsx', 'StatGraphs.tsx', 'app.css']),
 ('components/server/databases/DatabaseRow', ['pages/DatabaseRow.tsx']),
 ('components/server/databases/DatabasesContainer', ['pages/ServerDatabases.tsx']),
 ('components/server/network/AllocationRow', ['pages/AllocationRow.tsx']),
 ('components/server/network/NetworkContainer', ['pages/ServerNetwork.tsx']),
 ('components/server/backups/BackupContainer', ['pages/ServerBackups.tsx', 'pages/BackupGroupItem.tsx']),
 ('components/server/backups/BackupItem', ['pages/BackupRow.tsx']),
 ('components/server/schedules/ScheduleRow', ['pages/ScheduleRow.tsx']),
 ('components/server/schedules/ScheduleCronRow', ['ScheduleCronRow.tsx']),
 ('components/server/schedules/ScheduleContainer', ['pages/ServerSchedules.tsx']),
 ('components/server/startup/StartupContainer', ['pages/ServerStartup.tsx', 'GlobalVariables.tsx']),
 ('components/server/startup/VariableBox', ['pages/VariableBox.tsx']),
 ('components/server/settings/SettingsContainer', ['pages/ServerSettings.tsx', 'SftpDetails.tsx']),
 ('components/server/users/UserRow', ['pages/SubuserRow.tsx']),
 ('components/server/users/UsersContainer', ['pages/ServerSubusers.tsx']),
 ('components/server/files/FileObjectRow', ['pages/FileRow.tsx', 'pages/FileRowIcon.tsx', 'pages/SelectableFileRow.tsx', 'pages/FileParentDirectoryRow.tsx']),
 ('components/server/files/FileManagerBreadcrumbs', ['pages/FileBreadcrumbs.tsx']),
 ('components/server/files/FileManagerContainer', ['pages/ServerFiles.tsx']),
 ('components/server/files/NewDirectoryButton', ['pages/FileToolbar.tsx']),
 ('components/server/files/NewFileButton', ['pages/FileToolbar.tsx']),
 ('components/server/files/UploadButton', ['pages/FileToolbar.tsx']),
 ('components/server/ServerActivityLogContainer', ['pages/ServerActivity.tsx', 'ActivityList.tsx']),
 ('components/dashboard/ServerRow', ['pages/ServerItem.tsx', 'overrides.ts']),
 ('components/dashboard/AccountOverviewContainer', ['pages/DashboardAccount.tsx']),
 ('components/dashboard/AccountApiContainer', ['pages/DashboardApiKeys.tsx', 'pages/ApiKeyRow.tsx']),
 ('components/dashboard/ssh/AccountSSHContainer', ['pages/DashboardSshKeys.tsx', 'pages/SshKeyRow.tsx']),
 ('components/dashboard/activity/', ['pages/DashboardActivity.tsx', 'ActivityList.tsx', 'pages/ActivityRow.tsx']),
 ('components/dashboard/header/', ['PageLayout.tsx', 'headerSlots.ts', 'app.css']),
 ('components/dashboard/DashboardContainer', ['PageLayout.tsx', 'pages/ServerItem.tsx']),
 ('routers/AuthenticationRouter', ['AuthWrapper.tsx', 'app.css']),
 ('assets/css/', ['app.css', 'theme.ts']),
 ('assets/globals.css', ['app.css']),
 ('assets/tailwind', ['app.css']),
]
legacy = ('components/elements/MainSidebar', 'components/elements/MainPageHeader', 'components/elements/MainWrapper',
          'components/elements/MobileFullScreenMenu', 'components/elements/MobileTopBar')
unavailable = ('api/mclo.gs/', 'api/nests/', 'api/server/marketplace', 'api/server/network/subdomain',
 'api/server/applyEggChange', 'api/server/previewEggChange', 'components/server/software/',
 'components/server/installer/', 'components/server/network/SubdomainManagement',
 'components/server/backups/elytra/', 'components/server/features/', 'lib/mclogsUtils')
rows = []
for file in sorted(src.rglob('*')):
 if not file.is_file(): continue
 raw = file.read_bytes()
 content = raw.decode('utf-8', errors='replace') # Every file is read, including assets and declarations.
 name = file.relative_to(src).as_posix()
 destination = []
 if '.spec.' in name or name.startswith('__mocks__/'):
  status, reason = 'reference-test', 'Upstream test fixture targets the Pterodactyl implementation; Calagopus integration is checked with tools/visual-check.cjs.'
 elif name.startswith(unavailable):
  status, reason = 'reference-only feature', 'Hydrodactyl-specific product/backend integration has no matching Calagopus route/API; no nonfunctional control is installed.'
 elif name.startswith(legacy):
  status, reason = 'superseded layout', 'Modern UnifiedRouter uses the layout/header and layout/sidebar modules instead; their presentation is adapted in Sidebar.tsx.'
  destination = [E+'Sidebar.tsx']
 else:
  matching = next((targets for prefix, targets in ports if name.startswith(prefix)), None)
  if matching:
   status, reason = 'presentation adapted', 'Source presentation implemented with Calagopus data, permissions and interactions. This is an adaptation, not a byte-identical React module.'
   destination = [E+target for target in matching]
  elif name.startswith('api/'):
   status, reason = 'native API retained', 'Pterodactyl/Laravel request paths and response models are incompatible with Calagopus. Theme controllers call Calagopus APIs.'
   destination = [C+'api']
  elif name.startswith(('state/', 'plugins/', 'hoc/', 'context/', 'lib/', 'helpers', 'routers/', 'components/history', 'contexts/')) or name.endswith('.d.ts') or name in ('index.tsx', 'modes.ts'):
   status, reason = 'native runtime retained', 'Use Calagopus routing, Zustand/TanStack state, schemas, socket protocol and permission guards; replacing this with the reference runtime would break the panel.'
   destination = [C+'providers', C+'stores', E+'index.tsx']
  elif name.startswith('assets/images/'):
   status, reason = 'native feedback retained', 'Reference illustration is not required by the source-style feedback component; native Calagopus error/install messages remain available.'
   destination = [E+'Feedback.tsx']
  else:
   status, reason = 'shared presentation adapted', 'Native Calagopus control/dialog/page remains; shared source-derived styles and workspace hooks apply. Feature-specific internal layout is retained.'
   destination = [E+'app.css', E+'theme.ts', E+'PageLayout.tsx']
 for target in destination:
  if not (panel/target).exists(): raise SystemExit('Missing destination '+target+' for '+name)
 rows.append(dict(file=name, sha256=hashlib.sha256(raw).hexdigest(), bytes=len(raw), lines=content.count('\n'),
                  imports=sorted(set(re.findall(r'(?:from\s+|import\s*)[\'\"]([^\'\"]+)', content))),
                  status=status, destination=destination, reason=reason))
counts = dict(Counter(row['status'] for row in rows))
audit = dict(repository='https://github.com/BlueprintFramework/hydrodactyl', revision=revision, files=len(rows),
             scope='resources/scripts', counts=counts, entries=rows)
(extension/'SOURCE-AUDIT.json').write_text(json.dumps(audit, indent=2)+'\n')
header = f'''# Reference file audit\n\nReference revision: `{revision}`. All **{len(rows)}** files under `resources/scripts` were read and fingerprinted. This is an inventory of adaptation boundaries, not a claim that every upstream module executes inside Calagopus.\n\nThe extension replaces the modern shell, console, dashboard rows, main server resource pages, startup/settings and account resource pages. Remaining Calagopus pages use shared component and workspace styles. Native API clients, authentication, permission checks, dialogs, operations and drag/drop controllers remain authoritative. Hydrodactyl-only installer/software/marketplace/subdomain and game-specific integrations are not implemented by this theme.\n\n## Dispositions\n\n'''
header += '\n'.join(f'- {key}: {value}' for key,value in counts.items())+'\n\nReproduce: `python3 scripts/audit-source.py /path/to/hydrodactyl-reference`. JSON includes per-file SHA-256, imports, size, destinations and reasons.\n\n## Files\n\n| Reference file | Disposition | Destination |\n| --- | --- | --- |\n'
header += '\n'.join('| `'+r['file']+'` | '+r['status']+' | '+', '.join('`'+p.replace(E,'frontend/src/')+'`' for p in r['destination'])+' |' for r in rows)+'\n'
(extension/'SOURCE-AUDIT.md').write_text(header)
print(json.dumps({'files':len(rows),'counts':counts},indent=2))
