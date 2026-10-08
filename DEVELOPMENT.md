# Hydrodactyl Theme 2.1.11

Installable Calagopus >=1.2.4 extension, package `com.luxxy.hydrodactyl`. This release ports the modern Hydrodactyl shell and resource-page presentation using the reference repository at `e3c445fd4ecffe57e786894f8b9dfc6340526176`.

## Implemented presentation

- Modern 128px compact / 300px expanded sidebar, 64px header, configured Calagopus logo and source navigation icons, email user menu, mobile bottom navigation and focus-trapped drawer.
- Console with full-height terminal, source power controls, compact status/name/CPU/RAM/disk header and independently scrolling IP/uptime/CPU/RAM/network widgets. Source chart configuration and uptime helper are bundled.
- Dashboard server rows with glowing status dots and resource boxes. Flat and grouped views retain selection, groups, drag/drop and context menus; list/grid preference is saved per device.
- Files: source folder/file/archive icons and row proportions, folder/file/upload shortcuts, breadcrumbs and toolbar. Native virtualized selection, uploads, drag/drop, editor, preview and filesystem operations remain functional.
- Database, network, user, schedule and backup list layouts: source identity rows, icons, details/actions and cron fields. Calagopus-specific metadata, pagination, selection and additional operations remain available.
- Startup: source command/image layout, global variables and environment-variable cards. Settings: source rename/reinstall/SFTP layout plus native autostart/autokill/timezone controls.
- Account security overview, API-key and SSH-key rows and activity layout. Authentication steps share one source-style card with a gradient hero.
- Shared controls, inputs, menus, dialogs, tabs, alerts, empty/error states, editor/terminal colors, workspace frames and bundled Plus Jakarta Sans. Additional account/admin/Calagopus-only pages receive these shared styles while retaining their native internal layouts.

The theme uses Calagopus APIs, websocket protocol, authentication and permissions. Pterodactyl's Laravel/easy-peasy runtime cannot replace those controllers. Hydrodactyl-only installer/software/marketplace/subdomain and game-specific backend integrations are not included. This is not a verified pixel-for-pixel copy of every upstream feature. All **407** reference script files have a disposition, SHA-256 and destination/reason in [SOURCE-AUDIT.md](SOURCE-AUDIT.md) and [SOURCE-AUDIT.json](SOURCE-AUDIT.json).

## Develop

Source: `backend-extensions/com_luxxy_hydrodactyl/frontend`. In this checkout, `frontend/extensions/com_luxxy_hydrodactyl` is a symlink so Vite discovers the extension. `src/overrides.ts` uses Calagopus's supported build override for dashboard rows and falls back to the original row when disabled.

```sh
cd frontend
pnpm install
pnpm typecheck
pnpm build
pnpm dev
```

Run the backend on port 8000 for API proxying. Register the Rust companion using `extensions resync` and rebuild through Calagopus's normal workflow.

## Validation

TypeScript and the production frontend build pass. `tools/visual-check.cjs` renders the actual production bundle against intercepted synthetic API/socket fixtures: 16 desktop routes, five mobile layouts, desktop/mobile login, database/schedule dialogs, mobile navigation, read-only permission checks and the disabled-theme dashboard fallback. It checks runtime errors and horizontal overflow. It does not create data or validate live Wings/backend operations.

To regenerate fixtures from the current Calagopus schemas:

```sh
cd frontend
NODE_OPTIONS=--require="$PWD/../backend-extensions/com_luxxy_hydrodactyl/tools/fixture-env.cjs" \
  pnpm exec tsx --tsconfig tsconfig.json ../backend-extensions/com_luxxy_hydrodactyl/tools/visual-fixtures.ts /tmp/hydrodactyl-fixtures.json
pnpm exec vite preview --host 127.0.0.1 --port 4173
```

In another terminal, from the panel root, with Playwright and Chromium available:

```sh
node backend-extensions/com_luxxy_hydrodactyl/tools/visual-check.cjs /tmp/hydrodactyl-fixtures.json /tmp/theme-previews
```

Set `PLAYWRIGHT_MODULE` / `CHROMIUM_PATH` if the tools are installed elsewhere. The script serves built assets locally to avoid Vite's backend assets proxy. Reproduce the reference audit with `python3 tools/audit-source.py /path/to/hydrodactyl-reference` from the extension directory.

## Export and install

From the panel root with the normal panel environment variables configured:

```sh
cargo run -p panel-rs -- extensions export com.luxxy.hydrodactyl
```

Install `exported-extensions/com_luxxy_hydrodactyl.c7s.zip` through Calagopus extension management. Rebuild and restart as prompted. Appearance controls are at `/admin/extensions/com.luxxy.hydrodactyl`. Disable/remove through the normal extension controls and reload. The extension registers no backend routes, migrations or background tasks.

## Attribution

See `NOTICE`, `LICENSE-HYDRODACTYL.md` (Apache-2.0), `LICENSE_PTERO.md` and `LICENSE-CALAGOPUS.txt` (MIT), and `LICENSE-FONT.txt` (OFL).

### 2.1.1 colour correction

Neutral charcoal panels replace brown box surfaces. File rows keep their thin outlines and neutral hover surface; selected/upload/drop-target colours remain native. Admin section panels are raised above darker inset statistic cards.

### 2.1.2 source palette

Restores literal upstream colours rather than the neutral-charcoal substitutions: black/white shell (GlobalStylesheet.ts), mocha surfaces and cream accents (tailwind.css), translucent white title boxes (TitledGreyBox.tsx), and mocha/brand file-row states (files/style.module.css). The source palette is the dark theme; light mode remains a Calagopus adaptation.

### 2.1.3 mobile file manager

Parent-folder navigation uses the same source row palette/icon/borders as ordinary directories. Source-labelled New Folder/New File/Upload actions are grouped; native connect and advanced creation actions remain available. Mobile long names wrap instead of scrolling out of view, and virtualized rows keep dynamic height measurement. Synthetic browser checks include subdirectory navigation, a long folder name, and returning to the parent directory.

### 2.1.4 selection controls

Empty resource lists no longer render a select-all checkbox. File select-all is a separate control beside the path instead of a breadcrumb item, preventing clipping/separators and aligning it with file-row selection. Partial selection has a visible indeterminate state; checkbox controls have accessible labels and follow file action permissions. Browser checks cover row/all selection, clearing selection, alignment, and empty backups/users pages.

### 2.1.11 configured branding

- Header and login hero use the configured Calagopus banner or icon, including light-mode variants with the native fallbacks, instead of the Hydrodactyl logo.

### 2.1.10 compact utility labels

- Compact sidebar links grow to fit wrapped text, including the server’s View in Admin Area shortcut.

### 2.1.9 switch state

- Switch thumb movement uses Mantine’s input checked state and matching track/thumb dimensions. The track colour follows the actual checked input for controlled and uncontrolled switches.

### 2.1.8 tab-list overflow

- Horizontal tab lists stay on one line and scroll within the available width, including native route links. Vertical tabs retain their stacked layout.

### 2.1.7 hidden sidebar scrollbar

- Hide the sidebar scrollbar while retaining mouse-wheel, touch, and keyboard scrolling.

### 2.1.6 compact admin labels

- Compact admin navigation uses the full rail width and wraps long labels within each link. Link heights grow with the text so labels remain readable beside the scrollbar.

### 2.1.5 admin navigation

Admin routes retain their native route icons, including icons supplied by other extensions. They belong to the scrollable primary navigation rather than the fixed shortcuts area. Navigation links cannot shrink into overlapping rows; the rail has a thin scrollbar and the mobile drawer can reach the final link. Admin links are not duplicated into the mobile bottom bar. Browser checks verify distinct icons, desktop wheel scrolling and reaching the last link on desktop/mobile.
