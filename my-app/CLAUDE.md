# Chiplaw

## Concept
Marketplace de fichiers `.md` appelés "chips" — chaque chip transforme 
un agent IA générique (Claude, Cursor, GPT) en expert dans un domaine 
précis. Métaphore : Big Hero 6 — robot de base + puce = expert immédiat.

## Stack
- Framework : Next.js (App Router)
- Auth : Clerk
- Base de données : Supabase (Postgres)
- Paiement : Stripe
- Langage : TypeScript strict

## Architecture
```
app/
├── (auth)/          ← pages Clerk (login, signup)
├── (marketing)/     ← landing page, intro scroll-driven
├── (dashboard)/     ← espace utilisateur, chips achetées
├── (marketplace)/   ← liste et détail des chips
├── api/             ← webhooks Stripe, API routes
components/
├── ui/              ← composants génériques réutilisables
├── chips/           ← cartes chips, visuels SD 3D
├── marketing/       ← sections landing page
lib/
├── supabase.ts      ← client Supabase serveur
├── stripe.ts        ← client Stripe
└── utils.ts         ← helpers divers
```

## Modèle de données (Supabase)
- `chips` — les produits : id, title, domain, description, 
  price (en centimes), file_url, slug
- `purchases` — achats : id, user_id (Clerk), chip_id, 
  stripe_session_id, created_at
- `waitlist` — emails pré-inscription : id, email, created_at

## Business model
- Achat à l'unité : 499 centimes ($4.99) par chip
- Abonnement Pro : 999 centimes ($9.99/mois), accès illimité
- Waitlist early access : 299 centimes ($2.99/chip) à vie + 1 mois Pro offert

## Règles de comportement
- Toujours créer un plan avant de coder : liste les fichiers 
  à modifier/créer, explique l'approche, attends ma validation
- Modifications chirurgicales : ne toucher qu'à ce qui est 
  concerné par la tâche
- Si plusieurs options techniques, les présenter brièvement 
  avant de choisir
- Je suis débutant : expliquer les choix importants en 
  1-2 phrases max en français
- Ne jamais installer une dépendance sans me le signaler d'abord

## Identité visuelle — NE PAS DÉROGER
- Style : sombre, premium, cinématique — référence Linear / Vercel
- Fond : noir pur #000000 dominant
- Pas de couleurs vives sauf pour les chips (cartes SD 3D colorées)
- Couleurs des chips :
  - Frontend/Coding : #F97316 orange
  - SEO : #22C55E vert
  - QA : #A855F7 violet
  - UI/UX Design : #EAB308 jaune
  - Copy : #3B82F6 bleu
- Typographie : Instrument Serif italic pour les titres, Inter pour le reste
- Animations : scroll-driven, fluides — jamais kitsch
- Accent principal : #F59E0B amber

## Conventions code
- Langue : commentaires et variables en anglais, réponses à moi en français
- Composants : PascalCase, un composant par fichier
- Fichiers utilitaires : camelCase
- Pas de `any` TypeScript

## Ce qu'il ne faut jamais faire
- Ne pas toucher à `middleware.ts` sans expliquer pourquoi
- Ne pas supprimer de fichiers sans confirmation
- Ne pas casser l'intro scroll-driven existante dans app/page.tsx
- Ne pas modifier le style visuel établi sans que je le demande
- Ne jamais multiplier le prix par 100 — il est déjà en centimes dans Supabase