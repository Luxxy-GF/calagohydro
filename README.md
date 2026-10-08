# CalagoHydro

Hydrodactyl-inspired theme extension for **Calagopus >=1.2.4**, maintained by Luxxy-GF. Current version: **2.1.11**.

## Install

Download [com_luxxy_hydrodactyl-2.1.11.c7s.zip](releases/com_luxxy_hydrodactyl-2.1.11.c7s.zip) and import it through Calagopus extension management. Rebuild and restart as prompted.

Configure appearance at `/admin/extensions/com.luxxy.hydrodactyl`. The header and login branding follow your Calagopus banner/icon settings.

The extension ID stays `com.luxxy.hydrodactyl`, so this repository preserves compatibility with previously installed versions.

## Features

- Hydrodactyl palette, typography, server navigation, console, graphs and power controls.
- File manager, databases, allocations, backups, users, schedules, startup and settings presentation.
- Account, authentication and admin component styling.
- Responsive navigation with distinct admin icons, scrollable lists and hidden sidebar scrollbars.
- Wrapped compact navigation labels, horizontally scrolling tab bars and working switch thumbs.

Calagopus controllers, APIs, authentication, permissions and filesystem operations remain native. Upstream backend-only integrations are not included. See [DEVELOPMENT.md](DEVELOPMENT.md) for implementation details, validation and changelog.

## Develop

This is an extension, built inside a Calagopus panel checkout. It is not a standalone application.

Clone or place this repository at `backend-extensions/com_luxxy_hydrodactyl` within your panel checkout. From the panel root, register the frontend symlink if it is not already present:

```sh
ln -s ../../backend-extensions/com_luxxy_hydrodactyl/frontend frontend/extensions/com_luxxy_hydrodactyl
```

Then use the panel's normal extension resync and build workflow. From the panel root, with the normal environment variables configured:

```sh
cargo run -p panel-rs -- extensions resync
cd frontend
pnpm install
pnpm typecheck
pnpm build
cd ..
cargo run -p panel-rs -- extensions export com.luxxy.hydrodactyl
```

The Rust companion depends on the panel workspace. See [DEVELOPMENT.md](DEVELOPMENT.md) for local visual checks.

## Source and licences

Adapted from [BlueprintFramework/hydrodactyl](https://github.com/BlueprintFramework/hydrodactyl) at revision `e3c445fd4ecffe57e786894f8b9dfc6340526176`.

See [NOTICE](NOTICE), the bundled Apache-2.0, MIT and font OFL licence files, [SOURCE-AUDIT.md](SOURCE-AUDIT.md), and [SOURCE-COLOURS.md](SOURCE-COLOURS.md). This is an independent adaptation, not an official Hydrodactyl or Blueprint Framework product.
