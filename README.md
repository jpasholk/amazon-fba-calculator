# Amazon FBA Calculator 2025

A modern, responsive web application for calculating Amazon FBA fees, profit margins, and product viability. Built with Astro and featuring a clean, dialog-based interface with real-time calculations.

## ✨ Features

- **Real-time FBA Calculations**: Instantly calculate Amazon referral fees, fulfillment fees, and storage costs
- **Profit Analysis**: Get detailed profit margins, markup percentages, and break-even pricing
- **Success Criteria Assessment**: 4-point evaluation system with color-coded recommendations
- **Dual Unit System**: Switch between metric (cm/kg) and imperial (inches/lbs) units
- **Modern UI**: Clean dialog-based interface with responsive design
- **Product Summary**: Compact overview of entered product details
- **Mobile Friendly**: Fully responsive design that works on all devices

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/amazon-fba-calculator.git
cd amazon-fba-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to view the calculator in your browser.

## 🏗️ Project Structure

```
/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── starwind/       # UI component library
│   │   └── Calculator.astro # Main calculator component
│   ├── pages/
│   │   └── index.astro     # Homepage
│   ├── types/
│   │   └── calculator.ts   # TypeScript type definitions
│   └── utils/
│       └── fbaCalculations.ts # Amazon FBA calculation logic
└── package.json
```

## 📊 How It Works

### 1. Product Input
Enter your product details through the intuitive dialog interface:
- Product name and category
- Selling price and cost of goods
- Dimensions (length, width, height, weight)
- Inventory planning (average units in FBA)

### 2. Fee Calculations
The calculator computes:
- **Referral Fees**: Based on Amazon's category-specific rates
- **Fulfillment Fees**: Calculated using Amazon's size tier system
- **Storage Fees**: Monthly storage costs per unit and total inventory

### 3. Profitability Analysis
Get insights on:
- Net profit per unit
- Profit margin percentage
- Markup percentage
- Break-even price

### 4. Success Criteria
Automated assessment of:
- ✅ Lightweight product (< 2 lbs / 0.9 kg)
- ✅ Optimal price range ($15-$50)
- ✅ Healthy profit margin (> 30%)
- ✅ Good markup (> 100%)

## 🎨 Features in Detail

### Unit Conversion
- Toggle between metric (cm/kg) and imperial (inches/lbs)
- Automatic conversion of existing data when switching
- Real-time updates in product summary

### Success Criteria Scoring
- **4/4 Criteria**: Perfect FBA candidate! (Green)
- **3/4 Criteria**: Excellent FBA candidate! (Blue)
- **2/4 Criteria**: Good potential (Yellow)
- **1/4 Criteria**: Needs improvement (Orange)
- **0/4 Criteria**: Not recommended for FBA (Red)

### Responsive Design
- Desktop: Two-column layout with side-by-side results
- Mobile: Stacked layout for optimal viewing
- Dialog interface scales appropriately on all screen sizes

## 🛠️ Technology Stack

- **[Astro](https://astro.build/)**: Static site generator with component islands
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Starwind UI](https://starwind-ui.com/)**: Modern component library
- **Vanilla JavaScript**: Client-side interactivity

## 📋 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🔧 Customization

### Adding New Product Categories
Edit the category options in `src/components/Calculator.astro`:

```astro
<SelectItem value="new-category">New Category</SelectItem>
```

### Modifying Success Criteria
Update the criteria logic in `src/utils/fbaCalculations.ts`:

```typescript
export function evaluateSuccessCriteria(
  productData: ProductData,
  profitability: ProfitabilityData,
  useMetric: boolean = true
): SuccessCriterion[] {
  // Customize criteria here
}
```

### Adjusting Fee Calculations
Amazon's fee structure can change. Update the calculations in `src/utils/fbaCalculations.ts` to reflect current rates.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🚀 Deployment

### Netlify
```bash
npm run build
# Deploy the ./dist/ folder to Netlify
```

### Vercel
```bash
npm run build
# Deploy the ./dist/ folder to Vercel
```

### GitHub Pages
```bash
npm run build
# Deploy the ./dist/ folder to GitHub Pages
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Inspiration

Built to help Amazon FBA sellers make data-driven decisions about product viability and pricing strategies in 2025.

## 📞 Support

If you have questions or need help:
- Open an issue on GitHub
- Check the [Amazon FBA documentation](https://sellercentral.amazon.com/gp/help/external/200229180)
- Review Amazon's current fee structure

---

**Note**: This calculator provides estimates based on Amazon's published fee structure. Always verify current rates and policies directly with Amazon Seller Central.
