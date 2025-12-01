# Superior Seats - Setup & Deployment Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Static Assets](#static-assets)
- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)
- [Important Considerations](#important-considerations)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Superior Seats is a Next.js application with a Laravel backend API for 3D seat customization. The frontend handles 3D model rendering using Three.js, while the backend manages product data, materials, colors, and patterns.

**Key Architecture Points:**
- **Frontend**: Next.js 15 with TypeScript, Material-UI, Three.js
- **Backend**: Laravel API (separate repository)
- **3D Assets**: Static files in `public/assets/` (patterns, fabrics, models, textures)
- **Database**: MySQL/PostgreSQL (managed via Laravel migrations)

---

## 🔧 Requirements

### Frontend (This Repository)

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher (or yarn/pnpm)
- **Git**: Latest version

### Backend (Separate Repository)

- **PHP**: 8.1 or higher
- **Composer**: Latest version
- **MySQL/PostgreSQL**: 8.0+ / 13+
- **Laravel**: 10.x

### Optional

- **Docker**: For containerized development (if used)

---

## 💻 Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd Superior-Seats
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_IMAGE_BASE_URL=http://localhost:8000

# Optional: Square Payment (if using)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_square_app_id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_square_location_id
```

**Important**: Replace `localhost:8000` with your actual Laravel API URL.

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Backend Setup (Separate Repository)

**Note**: The backend API is in a separate repository (`superiorseats-api`).

1. Clone the backend repository
2. Install PHP dependencies: `composer install`
3. Copy `.env.example` to `.env` and configure database
4. Run migrations: `php artisan migrate`
5. Run seeders: `php artisan db:seed`
6. Start Laravel server: `php artisan serve` (default: `http://localhost:8000`)

**Critical Seeder**: Run `StaticAssetsSeeder` to bind database records with static 3D assets:
```bash
php artisan db:seed --class=StaticAssetsSeeder
```

---

## 🌍 Environment Variables

### Frontend (`.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Laravel API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_API_IMAGE_BASE_URL` | API image base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_SQUARE_APPLICATION_ID` | Square payment app ID | (optional) |
| `NEXT_PUBLIC_SQUARE_LOCATION_ID` | Square payment location ID | (optional) |

### Backend (`.env` in Laravel)

Required Laravel environment variables (configure in backend repository):
- Database credentials
- `APP_URL`
- `APP_ENV`
- CORS settings
- File storage configuration

---

## 🗄️ Database Setup

### Backend Database

1. **Create Database**:
   ```sql
   CREATE DATABASE superior_seats;
   ```

2. **Run Migrations**:
   ```bash
   php artisan migrate
   ```

3. **Run Seeders** (in order):
   ```bash
   # Essential system seeders
   php artisan db:seed --class=RoleSeeder
   php artisan db:seed --class=AdminSeeder
   php artisan db:seed --class=SettingSeeder
   
   # Static assets seeder (CRITICAL - binds 3D assets with database)
   php artisan db:seed --class=StaticAssetsSeeder
   ```

4. **Or run all seeders**:
   ```bash
   php artisan db:seed
   ```

### Database Structure

- **Materials, Colors, Patterns**: Managed via Admin UI (not seeders)
- **Static Assets**: Seeded via `StaticAssetsSeeder` to match `public/assets/` files
- **Products**: Created via Admin UI

---

## 📁 Static Assets

### Critical: Static Assets Location

All 3D assets are stored in `public/assets/` and **must match** database records:

```
public/assets/
├── patterns/
│   ├── 1/          # Model 1 patterns (1.jpg, 02.jpg, ..., 06.jpg)
│   └── 2/          # Model 2 patterns
├── stitchings/
│   ├── 1/          # Model 1 stitchings (1/1.png, 2/1.png, ...)
│   └── 2/          # Model 2 stitchings
├── fabrics/        # Material type preview images
│   ├── CarrollLeather.png
│   ├── MiamiVinyl.png
│   └── ...
├── models/         # 3D GLB model files
│   ├── 1/
│   └── 2/
└── textures/       # 3D texture maps
    ├── 1/
    └── 2/
```

### Asset Mapping

- **Patterns**: `static_pattern_id` in database (e.g., "1-2") → `/assets/patterns/1/02.jpg`
- **Materials**: `shader_id` in database (e.g., "carroll-leather") → `/assets/fabrics/CarrollLeather.png`
- **Models**: Product `model_file_path` → `/assets/models/{modelId}/chair1_v03.glb`

**⚠️ Important**: 
- Static assets are **NOT** uploaded via API
- They are manually placed in `public/assets/`
- Database records reference these static files via `static_pattern_id` and `shader_id`

---

## 🚀 Staging Deployment

### Frontend Deployment

1. **Build Application**:
   ```bash
   npm run build
   ```

2. **Environment Variables**:
   - Set `NEXT_PUBLIC_API_BASE_URL` to staging API URL
   - Set `NEXT_PUBLIC_API_IMAGE_BASE_URL` to staging API URL

3. **Deploy**:
   - Upload `public/assets/` folder (critical!)
   - Upload `.next` build folder
   - Configure server to serve Next.js app

### Backend Deployment

1. **Deploy Laravel API** to staging server
2. **Run Migrations**: `php artisan migrate`
3. **Run Seeders**: `php artisan db:seed`
4. **Configure CORS** to allow staging frontend domain
5. **Set File Permissions**: Ensure `storage` and `public` are writable

### Staging Checklist

- [ ] Static assets (`public/assets/`) uploaded
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Seeders run (especially `StaticAssetsSeeder`)
- [ ] CORS configured for staging domain
- [ ] API accessible from frontend
- [ ] File uploads working (images, GLB files)

---

## 🌐 Production Deployment

### Frontend Production

1. **Build for Production**:
   ```bash
   npm run build
   ```

2. **Environment Variables** (Production):
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
   NEXT_PUBLIC_API_IMAGE_BASE_URL=https://api.yourdomain.com
   ```

3. **Deploy**:
   - Use a hosting service (Vercel, AWS, etc.)
   - Ensure `public/assets/` is included in deployment
   - Configure production domain

### Backend Production

1. **Deploy Laravel API** to production server
2. **Environment**:
   - Set `APP_ENV=production`
   - Set `APP_DEBUG=false`
   - Configure production database
3. **Run Migrations**: `php artisan migrate --force`
4. **Run Seeders**: `php artisan db:seed --force`
5. **Optimize**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### Production Checklist

- [ ] Static assets uploaded to production
- [ ] Environment variables set (production values)
- [ ] Database migrations run
- [ ] Seeders run
- [ ] CORS configured for production domain
- [ ] SSL certificates configured
- [ ] File storage configured (S3, local, etc.)
- [ ] Backup strategy in place
- [ ] Monitoring/logging configured

---

## ⚠️ Important Considerations

### 1. Static Assets Management

- **DO NOT** delete or modify static assets without updating database
- **DO NOT** upload static assets via API (they're hardcoded)
- **DO** ensure `public/assets/` matches database `static_pattern_id` and `shader_id` values

### 2. Database vs Static Files

- **Database**: Stores metadata, prices, visibility, relationships
- **Static Files**: Store 3D textures, patterns, fabric previews
- **Binding**: `StaticAssetsSeeder` creates database records that reference static files

### 3. Material Types & Colors

- Created/managed via **Admin UI** (not seeders)
- Preview images uploaded via Admin UI (stored on backend server)
- Static fabric images in `public/assets/fabrics/` are for UI display only

### 4. Patterns

- Created via **Admin UI** with `static_pattern_id` (e.g., "1-2")
- `static_pattern_id` must match existing static files in `public/assets/patterns/`
- Preview images uploaded via Admin UI

### 5. Product ID in URL

- Product ID is passed via URL query parameter: `/build-your-seat?productId=123`
- This ensures product persists on page reload
- Required for order payload preparation

### 6. CORS Configuration

- Backend must allow frontend domain in CORS settings
- Update `config/cors.php` in Laravel backend
- Include paths: `images/products/3d-models/*`

### 7. File Uploads

- **GLB Files**: Uploaded via Admin UI → stored in `public/images/products/3d-models/`
- **Images**: Uploaded via Admin UI → stored in Laravel `storage/app/public/`
- **Static Assets**: Manually placed in `public/assets/` (not uploaded)

---

## 🔍 Troubleshooting

### Issue: 3D Model Not Loading

**Check**:
1. Product has `is_customize_3d_product = true`
2. Product has `model_file_path` set
3. GLB file exists at the path
4. CORS allows frontend domain

### Issue: Patterns/Materials Not Showing

**Check**:
1. `StaticAssetsSeeder` has been run
2. Static files exist in `public/assets/`
3. Database `static_pattern_id` matches file structure
4. Database `shader_id` matches fabric file names

### Issue: Images Not Loading

**Check**:
1. `NEXT_PUBLIC_API_IMAGE_BASE_URL` is correct
2. Backend file storage is configured
3. Files exist in `storage/app/public/`
4. `php artisan storage:link` has been run (if using local storage)

### Issue: Product ID Lost on Reload

**Check**:
1. URL includes `?productId=123` query parameter
2. `build-your-seat/page.tsx` reads from `useSearchParams()`
3. Component receives `productId` prop

### Issue: CORS Errors

**Check**:
1. Backend `config/cors.php` includes frontend domain
2. Backend includes CORS middleware on routes
3. Preflight requests are handled correctly

---

## 📞 Support

For issues or questions:
1. Check this README first
2. Review existing documentation files in repository
3. Check Laravel backend repository documentation
4. Contact development team

---

## 📝 Notes

- **Never commit** `.env.local` or `.env` files
- **Always backup** database before migrations
- **Test locally** before deploying to staging/production
- **Keep static assets** in sync with database records

---

**Last Updated**: 2025-01-XX
**Version**: 1.0.0

