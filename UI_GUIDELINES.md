# Microfinance UI Design Guidelines

This document serves as the "Source of Truth" for maintaining a consistent, premium, and professional UI/UX across the entire Microfinance project. All developers and AI agents must follow these patterns strictly.

## 1. Global Core Principles
- **Clarity & Simplicity**: Avoid visual clutter. Use white space effectively.
- **Consistency**: Every page must feel like part of the same application.
- **Modern Aesthetics**: Use subtle shadows, backdrop blurs (glassmorphism), and rounded corners.
- **Accessible Color Palette**: Use Emerald for success/paid, Amber for warnings/pending, and Rose for errors/unpaid.

---

## 2. Page Containers & Headers
- Use `PageHeader` component for all dashboard pages.
- **Main Container**: `flex flex-col gap-3 w-full md:px-4 pb-10`.
- **Spacing**: Use `gap-6` for section spacing and `gap-3` for tight layouts.

---

## 3. Cards (The Dashboard Standard)
Every major section or data table should be wrapped in a consistent card style.
- **Class**: `border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden`.
- **Card Content**: Use `p-0` for tables and `p-6` for forms/stats.

---

## 4. Tables (Data Management)
Tables are the heart of this application. Follow this structure exactly.

### Table Structure
```tsx
<Table>
  <TableHeader>
    <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
      <TableHead className="font-bold text-foreground">Header Name</TableHead>
      <TableHead className="font-bold text-foreground text-right">Amount</TableHead>
      <TableHead className="font-bold text-foreground text-center">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-primary/5 transition-colors group">
      <TableCell className="font-bold text-foreground group-hover:text-primary transition-colors">
        Primary Data
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Table Head Design
- **Standard**: `font-bold text-foreground`.
- **Alignment**: Use `text-right` for currencies/numbers and `text-center` for status/counts.

### Table Row Design
- **Header Row**: `bg-muted/30 hover:bg-muted/30 border-b`.
- **Data Row**: `hover:bg-primary/5 transition-colors group`.

---

## 5. Status Badges
Use consistent colors for statuses throughout the app.
- **APPROVED / PAID**: `bg-emerald-500 hover:bg-emerald-600` (Emerald).
- **PENDING / PARTIAL**: `bg-amber-500 hover:bg-amber-600` (Amber).
- **REJECTED / UNPAID**: `bg-rose-500 hover:bg-rose-600` (Rose).
- **COMPLETED**: `bg-blue-500 hover:bg-blue-600` (Blue).
- **Badge Style**: `border-none px-3 py-1 rounded-full font-bold text-white flex items-center gap-1 w-fit`.

---

## 6. Action Menus (Dropdowns)
Use the `MoreVertical` icon for table actions.
- **Trigger Style**: `rounded-full opacity-50 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer inline-block`.
- **Dropdown Content**: `bg-card/95 backdrop-blur-md`.

---

## 7. Form Elements
- **Inputs/Selects**: Use `bg-background/50 border-input/50 focus:ring-primary/20 rounded-lg`.
- **Standard Height**: `h-11`.
- **Search Inputs**: Always use a `Search` icon on the left with `absolute left-3`.

---

## 8. Typography Patterns
- **Main Titles**: `text-3xl font-black tracking-tighter text-slate-900`.
- **Subtitles**: `text-sm text-muted-foreground font-semibold`.
- **Entity Names (in tables)**: `font-bold text-foreground`.
- **Secondary Details**: `text-[10px] text-muted-foreground uppercase tracking-widest`.

---

## 9. Entity Detail Dropdowns (Sub-entities)
When a table cell refers to multiple sub-entities (e.g., "2 Guarantors"), use a `DropdownMenu`.
- **Interaction Pattern**: An inline-flex `div` or `Badge` with an icon (`ShieldCheck`), the count, and a `ChevronDown`.
- **Read-Only View Modals**: Use `bg-card/95 backdrop-blur-xl` and `shadow-2xl`.

---

## 10. Confirmation Dialogs (AlertDialog)
- **Visuals**: `bg-card/95 backdrop-blur-xl border-none shadow-2xl rounded-3xl`.
- **Primary Action**: `rounded-xl font-black px-8 h-12 shadow-lg transition-all`.
- **Destructive**: Use `bg-rose-500 hover:bg-rose-600`.
