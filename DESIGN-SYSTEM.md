# BRBs Minimal Design System

## 🎨 Design Philosophy

Clean, minimal, and functional. Focused on content with subtle visual elements.

---

## Color Palette

### Primary Colors
- **Gray 900** - `#111827` - Primary text, buttons
- **Gray 600** - `#4B5563` - Secondary text
- **Gray 400** - `#9CA3AF` - Tertiary text, placeholders
- **Gray 200** - `#E5E7EB` - Borders
- **Gray 100** - `#F3F4F6` - Subtle backgrounds
- **White** - `#FFFFFF` - Main background

### Accent Colors (Minimal Use)
- **Green 50/200/700** - Success states
- **Red 50/200/700** - Error states

---

## Typography

### Font Family
- **Inter** - Clean, modern sans-serif

### Font Weights
- `300` - Light - Large numbers, data display
- `400` - Regular - Body text
- `500` - Medium - Headings, labels
- `600` - Semi-bold - Minimal use

### Font Sizes
- `xs` - 12px - Labels, captions
- `sm` - 14px - Small text, buttons
- `base` - 16px - Body text
- `lg` - 18px - Input fields
- `xl` - 20px - Section headings
- `2xl` - 24px - Balance displays
- `4xl` - 36px - Page titles

---

## Spacing

### Consistent Spacing
- `2` - 8px - Tight spacing
- `3` - 12px - Small gaps
- `4` - 16px - Standard gaps
- `6` - 24px - Section padding
- `8` - 32px - Large gaps
- `12` - 48px - Section spacing
- `16` - 64px - Page padding

---

## Components

### Navbar
```
- White background
- 1px gray-200 bottom border
- No shadows
- Clean typography
- Subtle hover states
```

### Cards
```
- White background
- 1px gray-200 border
- Small border radius (8px)
- No shadows
- Consistent padding (24px)
```

### Buttons
```
Primary:
- bg-gray-900
- hover:bg-gray-800
- Rounded (8px)
- No shadows

Secondary:
- Text only
- Minimal styling
```

### Inputs
```
- Light border (gray-200)
- Focus: gray-400
- No heavy shadows
- Clean placeholders
- Font weight: light
```

### Typography Hierarchy
```
H1: text-4xl font-light
H2: text-lg font-medium
Body: text-sm text-gray-600
Caption: text-xs text-gray-400
```

---

## Layout Principles

### White Space
- Generous padding
- Clear section separation
- Breathing room around elements

### Grid System
- Responsive grid
- Consistent gaps
- Clean alignment

### Simplicity
- Minimal decorative elements
- No gradients
- Subtle transitions
- Flat design

---

## Interactive States

### Hover
- Subtle color shift (gray-600 → gray-900)
- No dramatic changes
- Smooth transitions (150ms)

### Focus
- Border color change
- No shadows
- Clear indication

### Disabled
- Gray-300 background
- Reduced opacity
- Clear disabled state

---

## Current Implementation

### Pages
- ✅ Dashboard - Minimal hero, clean cards
- ✅ Swap - Simple coming soon state
- ✅ Transactions - Clean empty state

### Components
- ✅ Navbar - Minimal border, no gradient
- ✅ BalanceCard - Light font weights, simple layout
- ✅ MintBurnCard - Clean tabs, minimal inputs
- ✅ TreasuryStats - Grid layout, simple stats

---

## Dos and Don'ts

### ✅ Do
- Use consistent spacing
- Keep borders subtle (1px, gray-200)
- Use light font weights for data
- Maintain white space
- Keep interactions subtle

### ❌ Don't
- Add gradients
- Use heavy shadows
- Over-decorate
- Use bright colors excessively
- Add unnecessary animations

---

## Accessibility

- High contrast text (gray-900 on white)
- Clear focus states
- Readable font sizes
- Proper semantic HTML
- ARIA labels where needed

---

**Philosophy:** Less is more. Every element serves a purpose.

