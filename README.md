# PCStore — Documentation du projet

Site web de vente et de réservation d'ordinateurs à Cotonou (Bénin), à destination du grand public. Trois fonctions principales : catalogue consultable, réservation sans paiement en ligne, et moteur de recommandation par règles (pas d'IA).

> **État actuel** : le design est figé par les maquettes HTML ci-dessous, et l'application
> Next.js **V1 est implémentée** dans le dossier [`pcstore/`](pcstore/) (voir son
> [README](pcstore/README.md) pour le démarrage).

---

## 1. Maquettes fournies

Chaque fichier HTML est autonome (CSS inline, zéro dépendance) et implémente fidèlement le système de design. Ouvrables directement dans un navigateur.

| Fichier | Page | Points clés |
|---------|------|-------------|
| `maquette-accueil.html` | Accueil | Hero + terminal de diagnostic animé, aperçu catalogue (3 machines), section recommandation avec barres de score, footer |
| `maquette-catalogue.html` | Catalogue (liste complète) | Grille filtrable par catégorie (chips) et par fourchette de prix, compteur de résultats, badge de stock (Ok / Faible / Rupture), état vide |
| `maquette-fiche-produit.html` | Fiche produit | Galerie, badges (stock / garantie / retrait), specs essentielles, fiche technique groupée en 3 catégories, bloc prix, encart règle métier 48h |
| `maquette-questionnaire.html` | Questionnaire 3 étapes | Wizard usage → budget → priorités (max 2), barre de progression, écran résultats (scores %, explication texte, prix, refaire) |
| `maquette-reservation.html` | Formulaire de réservation | Produit pré-rempli (+ prix), champs nom/téléphone/commentaire, validation, rappel règle 48h, écran de confirmation statut « En attente » |
| `maquette-admin.html` | Interface admin | Sidebar, stats (4 cartes), onglets Produits & Réservations, badges de stock et de statut, actions Valider / Refuser |

---

## 2. Design system (règle de contrôle)

### Palette
| Usage | Couleur |
|-------|---------|
| Fond principal | `#0a0e14` |
| Fond secondaire / sections alternées | `#0e131b` |
| Surface (cartes, panneaux) | `#121824` |
| Surface secondaire (hover, inputs) | `#171f2e` |
| Bordure / lignes | `#232d3f` |
| Texte principal | `#e7ecf3` |
| Texte atténué | `#7d8aa0` |
| Accent principal (CTA) | cyan `#4fe3ff` |
| Accent secondaire (badges) | violet `#9a7bff` |
| Succès / statut | vert `#5cf2a0` |
| Alerte | ambre `#ffb454` |
| Erreur / refus | rouge `#ff6b6b` |

### Typographie
- **Titres / marque** : Chakra Petch (500/600/700)
- **Texte courant** : Inter (400/500/600)
- **Données techniques** (spécs, prix, pourcentages, statuts) : **JetBrains Mono** — règle : toute donnée chiffrée ou technique en monospace dans toute l'interface.

### Principes visuels
- Dark mode uniquement.
- Coins arrondis 8–14 px.
- Un seul accent néon actif par composant (jamais cyan + violet empilés sur un même élément).
- Badges de statut sur fond translucide (opacité ~10%) de la couleur concernée, jamais en fond plein.
- Trame circuit imprimé (grille fine) en arrière-plan des héros avec masque radial pour estomper vers les bords.

---

## 3. Stack technique (V1)

| Couche | Choix |
|--------|-------|
| Frontend | Next.js (App Router) + React |
| Backend | API routes Next.js |
| Base de données | PostgreSQL (Vercel) / SQLite (dev) via Prisma |
| Auth admin | Session simple email / mot de passe, un seul admin |
| Style | Tailwind CSS ou CSS pur (au choix), en respectant strictement le design system |
| Déploiement | Vercel |

---

## 4. Pages côté client

1. **Accueil** — hero + CTA « Trouver mon PC » / « Voir le catalogue », terminal de diagnostic (aperçu animé usage → budget → résultat), aperçu catalogue (3–4 produits), teaser recommandation, footer.
2. **Catalogue** — liste complète, filtres catégorie (gaming / bureautique / création / développement) et fourchette de prix, cartes (nom, catégorie, CPU/GPU/RAM/stockage, prix, bouton réserver).
3. **Fiche produit** — galerie, badges (stock, garantie, lieu de retrait), specs essentielles + fiche technique groupée (performance / affichage & audio / connectique & autonomie), bloc prix + « Réserver ce PC », encart règle « réservation bloque 48h, paiement en boutique ».
4. **Questionnaire** — 3 étapes + écran résultats : usage (1 choix), budget (4 fourchettes), priorités (max 2) ; résultats classés par % avec explication textuelle + prix + lien fiche ; bouton refaire.
5. **Formulaire de réservation** — nom, téléphone, produit (pré-rempli), commentaire optionnel ; confirmation statut « en attente ».

---

## 6. Interface admin

- **Tableau de bord** : cartes statistiques (produits actifs, réservations en attente, stock faible, réservations du mois).
- **Produits** : table (nom, catégorie, prix, stock avec badge Ok/Faible/Rupture, actions Modifier/Supprimer), formulaire d'ajout/modification (nom, catégorie, description, prix, quantité, specs complètes, upload photos multiple), recherche/filtre.
- **Réservations** : liste (client, contact, produit, date, statut), actions Valider / Refuser, filtre par statut (en attente / confirmée / refusée).

---

## 7. Modèle de données

**Product**
- `id`, `name`, `category` (enum : gaming / bureautique / création / developpement), `shortDescription`
- `price` (FCFA), `stock` (int)
- specs : `cpu`, `gpu`, `ram`, `storage`, `screen`, `connectivity`, `battery`, `weight`
- `images` (liste d'URLs), `createdAt`, `updatedAt`

**Reservation**
- `id`, `productId` (relation), `clientName`, `clientPhone`, `comment` (optionnel)
- `status` (enum : `en_attente` / `confirmee` / `refusee`)
- `createdAt`

**AdminUser**
- `id`, `email`, `passwordHash`

---

## 8. Moteur de recommandation (V1 — sans IA)

Système de score par règles :
- Chaque produit possède des tags d'usage (peut correspondre à plusieurs usages avec des poids différents).
- Le budget déclaré élimine ou pénalise fortement les produits hors fourchette (sans les exclure totalement).
- Les priorités cochées (autonomie, puissance, écran, poids) apportent des bonus selon les caractéristiques.
- Score final normalisé en % et tri décroissant.
- Explication textuelle par produit générée par templates depuis les règles contributrices (ex. « RTX 4070 largement au-dessus du besoin pour X »).

---

## 9. Contraintes générales

- **Aucun paiement en ligne** — réservation + validation manuelle uniquement.
- Site **responsive mobile-first** (catalogue et questionnaire prioritaires).
- Accessibilité de base : focus clavier visible, contrastes suffisants sur fond sombre.
- Prix affichés en **[FCFA]**.
- Textes en français, ton direct, sans jargon marketing.

---

## 10. Prochaines étapes

1. ~Initialiser l'app Next.js + Prisma (schéma ci-dessus)~ — **fait**, voir `pcstore/`.
2. ~Décliner chaque maquette en composants React~ — **fait** (Tailwind, mêmes variables).
3. ~Implémenter les API routes (produits, réservations, auth) et la logique de score~ — **fait**.
4. ~Notification email admin (Resend) à chaque réservation~ — **fait** (fallback log sans clé).
5. À faire : brancher un vrai stockage objet pour l'upload de photos (Vercel Blob), domaines
   Resend validés en prod, tests E2E.