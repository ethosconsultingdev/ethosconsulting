# WordPress CMS Configuration

These files are the source-controlled CMS schema for the ETHOS headless WordPress installation.

## Installed Plugins

- Custom Post Type UI 1.19.3
- Secure Custom Fields 6.9.5

## Import CPT UI

1. Open `CPT UI > Tools` in WordPress.
2. Open the `Post Types` import section.
3. Paste the complete contents of `cptui-post-types.json` into `Import Post Types`.
4. Select `Import`.
5. Confirm the REST API exposes `services`, `methodology`, and `faqs`.

The import replaces CPT UI's complete post-type configuration. Do not register the same post types through SCF.

## Import SCF

1. Open `SCF > Tools` in WordPress.
2. Select `Import Field Groups`.
3. Import every JSON file under `scf-json/`.
4. Confirm every group is active and has `Show in REST API` enabled.

The page groups target the production page IDs created through the REST API:

- Homepage `Início`: ID 6
- Contact page `Contacto`: ID 7

If the pages are recreated with different IDs, update the `page` location rule in the corresponding JSON file before importing it.

## Seed Content

After both imports are complete, populate WordPress idempotently from the existing approved frontend copy and media:

```bash
pnpm cms:seed
```

The script updates records with matching slugs instead of creating duplicates.

## Ownership

- CPT UI owns post types and future taxonomies.
- SCF owns field groups only.
- The frontend owns validation, layout, routing, and safe fallback content.
- WordPress owns published copy, media, ordering, and article content.
