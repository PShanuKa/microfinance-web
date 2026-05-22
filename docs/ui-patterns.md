# Microfinance Dashboard UI Patterns & Logic Guide

This guide documents the standardized UI components, styling, and logic used in the **Clients Management** page. Use these patterns to maintain consistency across the application.

## 1. Page Structure & Layout

Every dashboard page should follow this hierarchical structure for a professional look:

```tsx
<div className="flex flex-col gap-3 w-full md:px-4">
  <PageHeader title="Title" description="Subtext">
    <Button>Action Button</Button>
  </PageHeader>

  <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
    <CardContent className="p-0">
      {/* Search & Filters Section */}
      {/* Table Section */}
    </CardContent>
  </Card>
</div>
```

## 2. Advanced Filtering with URL Sync

To make filters shareable (Shareable URLs), use `useSearchParams` and a centralized `updateFilters` function.

### Frontend Logic (Next.js)

```tsx
const router = useRouter();
const pathname = usePathname();
const searchParams = useSearchParams();

// State derived from URL
const statusFilter = searchParams.get("status") || "All";
const startDate = searchParams.get("startDate") || "";
const endDate = searchParams.get("endDate") || "";

// Centralized Update Function
const updateFilters = (updates: Record<string, string>) => {
  const params = new URLSearchParams(searchParams.toString());
  Object.entries(updates).forEach(([key, value]) => {
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });
  router.push(`${pathname}?${params.toString()}`);
  setPage(1); // Reset to first page on filter change
};
```

### Collapsible Filter UI (Accordion)

Use Shadcn **Accordion** to hide complex filters and keep the UI clean.

```tsx
<Accordion value={openItem} onValueChange={setOpenItem} className="w-full border-none">
  <AccordionItem value="item-1" className="border-none">
    <AccordionContent className="px-4 py-4 border-b bg-muted/20">
      <div className="flex flex-col md:flex-row items-end gap-4">
        {/* Status Select */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <Label className="text-xs text-muted-foreground ml-1">Status</Label>
          <Select value={statusFilter} onValueChange={(val) => updateFilters({ status: val })}>
            {/* Select Options... */}
          </Select>
        </div>

        {/* Date Input */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <Label className="text-xs text-muted-foreground ml-1">Start Date</Label>
          <Input type="date" value={startDate} onChange={(e) => updateFilters({ startDate: e.target.value })} />
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## 3. Search Term Highlighting

Enhance UX by highlighting the matching search prompt in the data table.

```tsx
const highlightText = (text: string, term: string) => {
  if (!term || !text) return text;
  const parts = text.toString().split(new RegExp(`(${term})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={i} className="bg-primary/20 text-primary font-black rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

// Usage in Table
<TableCell>{highlightText(client.fullname, search)}</TableCell>
```

## 4. Backend API Pattern (Node.js + Prisma)

Standardized pattern for multi-field search and specific filters.

### Client Search Pattern
```javascript
const where = {
  isDeleted: false,
  AND: [
    search ? {
      OR: [
        { fullname: { contains: search } },
        { nic: { contains: search } },
        { clientNo: { contains: search } },
        { phone: { contains: search } },
      ],
    } : {},
    status && status !== "All" ? { status } : {},
    startDate ? { createdAt: { gte: new Date(startDate) } } : {},
    endDate ? { createdAt: { lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) } } : {},
  ],
};
```

### Group Search Pattern (Relational Search)
When searching across relations (e.g., searching for a Group by its Officer's name), use the following Prisma structure:

```javascript
const where = {
  AND: [
    search ? {
      OR: [
        { name: { contains: search } },
        { groupNo: { contains: search } },
        { officer: { fullname: { contains: search } } }, // Search by Officer Name
        { members: { some: { isLeader: true, client: { fullname: { contains: search } } } } } // Search by Leader Name
      ],
    } : {},
    status && status !== "All" ? { status: status === "Active" } : {},
    collectionDay && collectionDay !== "All" ? { collectionDay: parseInt(collectionDay) } : {},
  ]
};
```

## 5. CSS & Styling Guidelines

*   **Backgrounds**: Use `bg-muted/20` or `bg-card/60` with `backdrop-blur-md` for a premium glassmorphism effect.
*   **Cards**: Always use `border-none shadow-xl` for main content containers.
*   **Interactive Elements**: Use `hover:bg-primary/5 transition-colors group` on table rows.
*   **Badges**: Use semantic colors (Emerald for Active, Rose for Blacklisted/Inactive).
*   **Filters Toggle**: Use a clean div with a Filter icon to trigger the Accordion.
