<div align="center">

# CalagoHydro

A Hydrodactyl-inspired theme for **Calagopus Panel**.

**Version 1.0.0** · **Calagopus 1.2.4+** · Apache-2.0 / MIT / font OFL

![CalagoHydro console](photos/console.png)

</div>

## Features

- Hydrodactyl colours, typography, console, resource graphs, server navigation and power controls.
- File manager, databases, network, backups, users, schedules, startup, settings and activity presentation.
- Account, API keys, SSH keys, login and shared admin styles.
- Desktop sidebar and mobile navigation, distinct admin icons, hidden scrollbars and wrapped link labels.
- Scrollable tab bars, working switch thumbs and configurable Calagopus branding.

Calagopus APIs, permissions, authentication and server operations remain native. Upstream backend-only integrations are not included. See [DEVELOPMENT.md](DEVELOPMENT.md) for implementation details and validation.

## Screenshots

These screenshots show the actual theme running locally with synthetic demo data. The console example is an offline server. All images live in [`photos/`](photos/README.md), where you can replace them with screenshots of your own panel.

| Servers | Console |
| --- | --- |
| ![Servers](photos/servers.png) | ![Console](photos/console.png) |

| Files | Databases |
| --- | --- |
| ![Files](photos/files.png) | ![Databases](photos/databases.png) |

| Network | Backups |
| --- | --- |
| ![Network](photos/network.png) | ![Backups](photos/backups.png) |

| Users | Schedules |
| --- | --- |
| ![Users](photos/users.png) | ![Schedules](photos/schedules.png) |

| Startup | Settings |
| --- | --- |
| ![Startup](photos/startup.png) | ![Settings](photos/settings.png) |

| Server activity | Account |
| --- | --- |
| ![Server activity](photos/activity.png) | ![Account](photos/account.png) |

| API keys | SSH keys |
| --- | --- |
| ![API keys](photos/api-keys.png) | ![SSH keys](photos/ssh-keys.png) |

| Account activity | Admin overview |
| --- | --- |
| ![Account activity](photos/account-activity.png) | ![Admin overview](photos/admin.png) |

### Sign in

![Sign in](photos/login.png)

### Mobile

| Console | Files |
| --- | --- |
| <img src="photos/mobile-console.png" alt="Mobile console" width="260"> | <img src="photos/mobile-files.png" alt="Mobile files" width="260"> |

| Account | Admin |
| --- | --- |
| <img src="photos/mobile-account.png" alt="Mobile account" width="260"> | <img src="photos/mobile-admin.png" alt="Mobile admin" width="260"> |

<img src="photos/mobile-login.png" alt="Mobile sign in" width="260">

## Install

1. Download [`calagohydro-1.0.0.c7s.zip`](releases/calagohydro-1.0.0.c7s.zip), or build it using `python3 scripts/package.py`.
2. Open **Admin → Extensions** in Calagopus and import the ZIP.
3. Rebuild and restart as prompted.

Appearance settings: `/admin/extensions/com.luxxy.hydrodactyl`. The extension ID remains `com.luxxy.hydrodactyl` for compatibility with previous installs. Site branding follows your configured Calagopus banner or icon.

## Repository layout

```text
Metadata.toml       Extension identity and panel compatibility
backend/            Rust companion and Cargo manifest
frontend/           Theme source, components, styles and font
photos/             Desktop and mobile screenshots used above
scripts/            Packaging, fixtures, screenshots and visual checks
releases/           Installable v1.0.0 ZIP and SHA-256 checksum
dist/               Generated packages (ignored by Git)
DEVELOPMENT.md      Build notes, implementation details and changelog
SOURCE-AUDIT.*      Upstream source mapping
SOURCE-COLOURS.md   Palette references
LICENSE* / NOTICE   Licences and attribution
```

The source layout follows the extension structure used by [Zoron Theme](https://github.com/Caloptreyx/Zoron-Theme). The theme code and screenshots here are CalagoHydro's.

## Development

This is a Calagopus extension, built and tested against a panel checkout. Run `python3 scripts/package.py` to create the installable package; the script keeps photos and repository tooling out of the extension ZIP. For frontend builds and screenshot generation, see [DEVELOPMENT.md](DEVELOPMENT.md).

## Attribution and licences

Adapted from [BlueprintFramework/hydrodactyl](https://github.com/BlueprintFramework/hydrodactyl) at revision `e3c445fd4ecffe57e786894f8b9dfc6340526176`.

See [NOTICE](NOTICE), [LICENSE](LICENSE), [LICENSE_PTERO.md](LICENSE_PTERO.md), [LICENSE-CALAGOPUS.txt](LICENSE-CALAGOPUS.txt), and [LICENSE-FONT.txt](LICENSE-FONT.txt). This is an independent adaptation, not an official Hydrodactyl or Blueprint Framework product.
