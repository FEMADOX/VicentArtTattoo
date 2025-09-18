# 🎨 Vicentart - Tattoo Artist Portfolio Website

A modern, responsive single-page application showcasing the work and services of Vicentart, a professional tattoo artist based in New Port Richey, FL.

## 🌟 Features

- **Modern Design**: Clean, professional layout with artistic typography
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Smooth Navigation**: Single-page application with smooth scroll navigation
- **Portfolio Gallery**: Interactive image gallery showcasing tattoo artwork
- **Contact Information**: Easy access to booking and contact details
- **Performance Optimized**: Built with Vite for fast loading and development

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (Cinzel, Roboto)
- **Code Quality**: ESLint + Prettier with StandardJS configuration

## 📂 Project Structure

```bash
src/
├── components/
│   ├── NavigationBar.tsx    # Fixed navigation bar
│   ├── PortfolioCard.tsx    # Portfolio image component
│   └── index.ts             # Component exports
├── assets/
│   └── images/              # Portfolio and profile images
│       └── index.ts         # Image exports
├── App.tsx                  # Main application component
├── App.css                  # Global styles and font imports
├── index.css                # Base styles
└── main.tsx                 # Application entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd VicentArtTatto
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser

## 📜 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint to check for code issues
- `pnpm lint:fix` - Automatically fix ESLint issues where possible
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check if code is properly formatted
- `pnpm type-check` - Run TypeScript type checking
- `pnpm check-all` - Run all quality checks (TypeScript, ESLint, Prettier)

## 🎨 Design Features

### Typography

- **Primary Font**: Cinzel (elegant serif for headings)
- **Secondary Font**: Roboto (clean sans-serif for body text)
- **Special Characters**: Unicode styling for unique text effects

### Layout Sections

1. **Home**: Hero section with artist introduction and booking information
2. **Portfolio**: Gallery of tattoo artwork with hover effects
3. **Contact**: Booking information and contact details
4. **About**: Artist biography and philosophy

### Visual Elements

- Background logo pattern with opacity overlay
- Smooth hover animations and transitions
- Responsive image galleries
- Fixed navigation with smooth scroll

## 🔧 Code Quality & Formatting

This project is configured with:

- **ESLint** with StandardJS configuration (`eslint-config-love`) for TypeScript/React
- **Prettier** for code formatting with StandardJS-compatible settings
- **TypeScript** with strict type checking

### VS Code Integration

The project includes VS Code settings that will:

- Format code with Prettier on save
- Fix ESLint issues on save
- Provide proper TypeScript support

Install the recommended extensions for the best development experience.

## 📱 Contact Information

### Vicentart Tattoo Studio

- **Location**: 9117 Little Rd, New Port Richey, FL 34654
- **Email**: <vicentartattoo@gmail.com>
- **Phone**: 813-696-1137
- **Booking**: By appointment only

### How to Book

Please include in your message:

- A short description of your idea
- Desired size & placement
- Days of the week or specific dates that work for you
- Budget

### Payment Methods

- Cash App
- Zelle
- Apple Pay
- Venmo
- Cash (in-person at shop)

## 🎯 Business Policies

- **Deposits**: Required to confirm appointments (non-refundable)
- **Design Process**: Custom designs created before appointment
- **Rescheduling**: Second deposit required for date changes
- **Cancellations**: Please provide adequate notice

## 🖼️ Portfolio Highlights

The website showcases Vicentart's expertise in:

- Hyper-realistic black and grey tattoos
- Vibrant color designs
- Custom artwork tailored to each client
- Personal storytelling through ink

## 🌐 Deployment

### Build for Production

```bash
pnpm build
```

The build artifacts will be stored in the `dist/` directory.

### Deploy to Static Hosting

This project can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use GitHub Actions for automatic deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vite Team** for the excellent build tool
- **Tailwind CSS** for the utility-first CSS framework
- **Google Fonts** for the beautiful typography
- **React Community** for the robust ecosystem

---

_Transforming personal stories into breathtaking pieces of art, one tattoo at a time._
