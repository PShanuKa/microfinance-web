# Microfinance System UI Guidelines

This document outlines the standard UI patterns and components to be used across all dashboard pages in the Microfinance System. Adhering to these guidelines ensures visual consistency and a premium user experience.

## 1. Page Structure

Every dashboard page should follow this basic structure:

```tsx
<div className="flex flex-col gap-3 w-full md:px-4">
  <PageHeader 
    title="Page Title" 
    description="Brief description of the page purpose"
  >
    {/* Primary action buttons like "Add New" */}
    <Button className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
      <Plus className="h-4 w-4" /> New Item
    </Button>
  </PageHeader>

  <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
    <CardContent className="p-0">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-muted/20 gap-4">
        {/* Search Input */}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table>...</Table>
      </div>

      {/* Pagination Section */}
      <div className="p-4 border-t bg-muted/20">
        <Pagination>...</Pagination>
      </div>
    </CardContent>
  </Card>
</div>
```

## 2. Card Design (Premium Look)
- **Background**: `bg-card/60` (semi-transparent for glassmorphism).
- **Effects**: `backdrop-blur-md`, `shadow-xl`.
- **Border**: `border-none`.
- **Content Padding**: Use `p-0` on `CardContent` if it contains a table to allow the table to reach the edges.

## 3. Table Styling
- **Header**: Use `bg-muted/30 hover:bg-muted/30 border-b` on the `TableRow` inside `TableHeader`. Headers should be `font-bold text-foreground`.
- **Rows**: Use `hover:bg-primary/5 transition-colors group` on `TableRow` for a smooth interactive feel.
- **Cells**: Use `font-bold` for primary identifiers (e.g., Names, IDs). Use `font-mono text-xs text-muted-foreground` for secondary technical identifiers.

## 4. Interactive Elements

### Dropdown Menu (Actions)
- **Trigger**: **CRITICAL**: Use a `div` inside `DropdownMenuTrigger`, **NOT** a `Button`. This avoids hydration errors and invalid HTML nesting.
- **Style**: 
  ```tsx
  <DropdownMenuTrigger>
    <div className="rounded-full opacity-50 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted cursor-pointer inline-block">
      <MoreVertical className="h-4 w-4" />
    </div>
  </DropdownMenuTrigger>
  ```
- **Content**: Use `bg-card/95 backdrop-blur-md` on `DropdownMenuContent`.

### Badges (Status)
Use consistent colors for statuses:
- **Active / Success**: `bg-emerald-500 hover:bg-emerald-600 text-white`.
- **Inactive / Error / Rejected**: `bg-rose-500 hover:bg-rose-600 text-white`.
- **Pending / Warning**: `bg-amber-500 hover:bg-amber-600 text-white`.
- **Secondary / Draft**: `variant="outline" text-muted-foreground`.

## 5. Modals (Dialogs)
- **Width**: Standardize on `sm:max-w-[700px]` for registration or editing forms.
- **Styles**: `bg-card/95 backdrop-blur-lg border-none shadow-2xl`.
- **Headers**: Use `text-2xl font-bold` for the title.

## 6. Icons (Lucide-React)
- Standard size: `h-4 w-4`.
- For status badges/table details: `h-3.5 w-3.5`.

## 7. Pagination
Always use the `Pagination` component from `@/components/ui/pagination` instead of simple buttons for a more professional navigation experience.

---
*Note: Always use Tailwind utility classes defined in the global design system. Avoid ad-hoc inline styles.*
