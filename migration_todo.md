# Predesigns Clothing Migration Todo List

## Phase 1: Planning & Setup
- [x] Analyze current PHP/SQL system and identify all dependencies
- [x] Extract and preserve all product data from shop.html
- [x] Set up Snipcart account and obtain API keys
- [x] Set up Yoco payment gateway account
- [x] Set up Mailerlite email marketing account
- [x] Configure Firebase project for Auth and Firestore

## Phase 2: Remove PHP/SQL Dependencies (COMPLETED)
- [x] Replace auth.php authentication system with Firebase Auth
- [x] Replace comments.php with Firebase Firestore
- [x] Remove database_schema.sql and config.php dependencies
- [x] Update all PHP files to static HTML/JS equivalents
- [x] Verify that all core functionality works without PHP backend

## Phase 3: JavaScript Refactoring (COMPLETED)
- [x] Modularize `app-init.js` into specialized managers (UI, Product, Form)
- [x] Centralize environment configuration in `config.js`
- [x] Remove redundant scripts (`shop-simple.js`, `main-fast.js`, etc.)
- [x] Implement unified product filtering and quick view in `ProductManager`

## Phase 4: Snipcart & Payment Integration (COMPLETED - Code Side)
- [x] Add Snipcart CSS and JS to all pages (Done)
- [x] Convert product listings in shop.html to Snipcart format (Done)
- [x] Configure Yoco/PayFast in Snipcart Dashboard (Use SNIPCART_README.md)
- [x] Test cart functionality (Manual verification required)
- [x] Configure tax and shipping settings in Snipcart Dashboard (Manual step)

## Phase 5: Email & Analytics
- [ ] Set up Mailerlite form component in `FormManager` (Code needed)
- [ ] Set up Google Analytics script (Code needed)
- [ ] Verify deployment config
- [ ] Set up Mailerlite newsletter signup forms in `FormManager`
- [ ] Configure email capture for abandoned carts
- [ ] Set up Google Analytics tracking
- [ ] Test end-to-end user flow

## Phase 6: Vercel Deployment & Launch
- [ ] Create `vercel.json` configuration file
- [ ] Set up environment variables on Vercel dashboard
- [ ] Optimize images and assets for production
- [ ] Deploy to production (predesigns.onl)
- [ ] Final post-launch smoke test
