# Hydrodactyl dark colours

Reference commit: `e3c445fd4ecffe57e786894f8b9dfc6340526176`.

| Element | Source value | Source file under resources/scripts |
| --- | --- | --- |
| Shell | `#000000` | assets/css/GlobalStylesheet.ts |
| Default text | `#ffffff` | assets/css/GlobalStylesheet.ts |
| Raised workspace / console / graphs | `#110f0d` | assets/tailwind.css; components/server/console/StatGraphs.tsx |
| Secondary text | `#fff6eb9c` | assets/tailwind.css |
| Primary cream | `#fff1e0` | assets/tailwind.css |
| Primary foreground | `#1d1816` | assets/tailwind.css |
| Titled box fill / border | `#ffffff08` / `#ffffff07` | components/elements/TitledGreyBox.tsx |
| File row | `#1d1816` (mocha-500) | components/server/files/style.module.css; assets/tailwind.css |
| File hover | `#29241f` (mocha-400) | components/server/files/style.module.css; assets/tailwind.css |
| File border | `#433b32` at 50% (mocha-300/50) | components/server/files/style.module.css; assets/tailwind.css |
| Hover border | `#5d5246` at 50% (mocha-200/50) | components/server/files/style.module.css; assets/tailwind.css |
| Selected file | `oklch(0.5108 0.1316 48.74 / 0.2)` (brand-700/20) | components/server/files/style.module.css; assets/tailwind.css |
| Selected border | `oklch(0.7123 0.1602 52.23 / 0.3)` (brand-500/30) | components/server/files/style.module.css; assets/tailwind.css |

Translucent fills stay translucent so nested surfaces blend as in the source. File selection paints on the row once; cells stay transparent, avoiding doubled opacity. Light mode is a separate Calagopus adaptation.
