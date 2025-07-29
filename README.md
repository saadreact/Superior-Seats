# Superior Seats - Next.js + Material UI Starter

A modern, responsive Next.js application built with Material UI and TypeScript. This starter project demonstrates best practices for creating responsive web applications with a beautiful, professional design.

## 🚀 Features

- **Next.js 15** with App Router
- **Material UI v5** with custom theme
- **TypeScript** for type safety
- **Responsive Design** that works on all devices
- **Modern UI/UX** with smooth animations
- **Accessibility** built-in
- **SEO Optimized** with proper metadata
- **Performance Optimized** with best practices

## 📱 Responsive Design

This project is fully responsive and includes:

- **Mobile-first approach** with Material UI breakpoints
- **Responsive navigation** with hamburger menu on mobile
- **Adaptive typography** that scales across devices
- **Flexible grid system** using Material UI Grid
- **Touch-friendly** interface elements
- **Optimized images** and media queries

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: Material UI v5
- **Styling**: Emotion (CSS-in-JS)
- **Language**: TypeScript
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config

## 📦 Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd Superior-Seats
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🎨 Customization

### Theme Configuration

The Material UI theme is configured in `src/theme/theme.ts`. You can customize:

- **Colors**: Primary, secondary, and background colors
- **Typography**: Font families, sizes, and responsive variants
- **Components**: Button styles, card shadows, etc.
- **Breakpoints**: Responsive breakpoint values

### Adding New Components

1. Create new components in `src/components/`
2. Use Material UI components for consistency
3. Implement responsive design using `useMediaQuery` hook
4. Follow the existing component patterns

### Responsive Design Patterns

```tsx
// Responsive breakpoints
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

// Responsive styling
sx={{
  fontSize: { xs: '1rem', md: '1.25rem' },
  padding: { xs: 2, md: 4 },
  width: { xs: '100%', sm: '50%', md: '25%' }
}}
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout with theme provider
│   ├── page.tsx        # Home page component
│   └── globals.css     # Global styles
├── components/          # Reusable components
│   ├── Header.tsx      # Responsive navigation
│   └── HeroSection.tsx # Hero section component
└── theme/              # Material UI theme
    └── theme.ts        # Custom theme configuration
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Responsive Breakpoints

- **xs**: 0px - 599px (Mobile)
- **sm**: 600px - 959px (Tablet)
- **md**: 960px - 1279px (Small Desktop)
- **lg**: 1280px - 1919px (Desktop)
- **xl**: 1920px+ (Large Desktop)

## 🎯 Key Features Demonstrated

1. **Responsive Navigation**: Collapsible menu on mobile
2. **Hero Section**: Gradient background with responsive layout
3. **Product Cards**: Hover effects and responsive grid
4. **Statistics Section**: Responsive number display
5. **Call-to-Action**: Responsive button layout
6. **Typography**: Responsive font sizes
7. **Spacing**: Responsive padding and margins

## 🔧 Development Tips

1. **Use Material UI's responsive utilities**:
   ```tsx
   useMediaQuery(theme.breakpoints.down('md'))
   ```

2. **Implement responsive styling**:
   ```tsx
   sx={{
     width: { xs: '100%', sm: '50%', md: '25%' }
   }}
   ```

3. **Test on different screen sizes** using browser dev tools

4. **Follow Material Design principles** for consistent UI

## 📄 License

This project is open source and available under the [ISC License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test responsiveness across devices
5. Submit a pull request

---

**Built with ❤️ using Next.js and Material UI**