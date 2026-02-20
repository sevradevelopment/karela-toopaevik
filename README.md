# Tööpäevik – Karela Transport OÜ

Tööpäeviku rakendus: sisselogimine, töötunnid, vedu, tankimine, hakkepuidu tootmine (m³), statistika ja haldus.

## Tehnoloogia

- **Vite** + **React** + **React Router**
- **Tailwind CSS**
- **Supabase** (auth + andmebaas)

## Seadistus

1. Klooni või kopeeri projekt.
2. Loo fail `.env` (võta näide failist `.env.example`):
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxx
   ```
3. Käivita Supabase SQL Editoris fail `supabase/schema.sql` (tabelid, RLS, trigger, vaikimisi andmed).
4. Paigalda sõltuvused ja käivita:
   ```bash
   npm install
   npm run dev
   ```
5. Build väljund kausta `dist`:
   ```bash
   npm run build
   ```
   Tulemus on kaustas `dist/`.

## Rollid

- **Admin** – kasutajate haldus, numbrimärgid, asukohad, statistika ja Exceli allalaadimine.
- **Vedaja** – töötunnid, vedu, tankimine, logid.
- **Hakkur** – sama + hakkepuidu tootmine (m³), tankimine numbrimärgiga 0371TH.

## Struktuur

```
karela-toopaevik/
  src/
    components/   Layout, Nav
    context/      Auth, Toast
    lib/          supabase
    pages/        Login, Home, Tankimine, Tunnid, Vedu, Tootmine, Logid, Statistika, Haldus
  supabase/
    schema.sql
  dist/           (pärast npm run build)
```
