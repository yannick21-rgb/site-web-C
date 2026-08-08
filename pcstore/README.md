# PCStore — Application Next.js

Site de vente/réservation d'ordinateurs à Cotonou (Bénin). Catalogue, réservation sans
paiement en ligne, et moteur de recommandation par règles.

Les maquettes HTML du design system sont dans le dossier parent (`maquette-*.html`).
La documentation générale du projet se trouve dans `../README.md`.

## Démarrage rapide

```bash
npm install
cp .env.example .env   # puis éditer les valeurs
npm run db:push        # crée la base SQLite + le client
npm run db:seed        # 6 produits + admin par défaut
npm run dev
```

Admin de démo : `admin@pcstore.bj` / `pcstore2026` — à changer après le premier login.

## Variables d'environnement

| Variable | Rôle |
|----------|------|
| `DATABASE_URL` | `file:./dev.db` en local, PostgreSQL sur Vercel |
| `AUTH_SECRET` | Secret HMAC des sessions admin (obligatoire en prod) |
| `ADMIN_NOTIF_EMAIL` | Email de l'admin qui reçoit les notifications de réservation |
| `EMAIL_FROM` | Expéditeur des emails (domaine validé Resend en prod) |
| `RESEND_API_KEY` | Clé API Resend. Absente → notifications en mode log (dev) |

## Règles métier

- La réservation bloque l'unité **48h** ; le paiement se fait en boutique au retrait.
- Chaque réservation publique crée un statut `EN_ATTENTE` et déclenche une **notification
  email à l'admin** (Resend). Sans clé API, la notification est journalisée dans la console.
- Pas de paiement en ligne.

## Structure

```
app/
  page.tsx                    Accueil (hero + terminal + aperçu catalogue)
  catalogue/                  Liste filtrable
  produits/[id]/              Fiche produit
  questionnaire/              Wizard 3 étapes (usage, budget, priorités)
  recommandation/             Résultats classés par score de correspondance
  reserver/                   Formulaire de réservation + confirmation
  admin/                      Login + dashboard + produits + réservations (protégé)
  api/                        produits, réservations, auth (login/logout)
components/                   Header, Footer, ProductCard, Gallery, forms...
lib/
  scoring.ts                  Moteur de recommandation (règles + templates)
  mail.ts                     Notification email admin (Resend + fallback log)
  auth.ts                     Sessions HMAC (cookie signé)
  db.ts                       Client Prisma
prisma/
  schema.prisma               Product, Reservation, AdminUser
  seed.ts                     Données de démo
```

## Moteur de recommandation

Score par règles, sans IA : adéquation usage (62 pts), adéquation budget (23 pts), bonus
priorités (15 pts max). Explications générées par templates, affichées sur chaque résultat.

## Déploiement Vercel

Le provider Prisma est **détecté automatiquement** d'après `DATABASE_URL` (via
`scripts/prepare-prisma.ts`, exécuté au `postinstall` et avant chaque commande Prisma/build) :
- `file:...` → SQLite (dev local)
- `postgres://` ou `postgresql://` → PostgreSQL (prod)

1. Créer une base **PostgreSQL** (Vercel Postgres ou Neon) → copier l'URL dans `DATABASE_URL`.
2. Configurer dans le dashboard Vercel :
   - `DATABASE_URL` (PostgreSQL)
   - `AUTH_SECRET` (secret aléatoire long)
   - `RESEND_API_KEY` + `EMAIL_FROM` + `ADMIN_NOTIF_EMAIL`
3. **Import du repo sur Vercel** : le build command par défaut (`next build`) suffit — le
   `postinstall` sélectionne le provider PostgreSQL et génère le client Prisma. Vercel
   gère le cache seul.
4. Initialiser la base de prod (migration + données) :
   ```bash
   DATABASE_URL="postgresql://…" npm run db:deploy   # schéma + seed (admin de démo + produits)
   ```
   ou lancer `npm run admin:create` après `db:deploy` pour créer un admin à ton adresse.
5. Pousser la branche `main` → Vercel redéploie automatiquement.

> Note : `prisma db push` côté prod sans pré-migration est volontaire (pas encore de
> système de migrations versionnées) ; les données ne sont pas recréées à chaque
> déploiement puisque `db:deploy`/`admin:create` ne sont pas appelés par le build.

## Règles métier
