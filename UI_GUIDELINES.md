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
## 7. User Management Architecture
The user management system is built using a combination of Shadcn primitives and custom form logic to provide a secure and intuitive experience.

### Core Components Used:
- **Navigation & Layout**: `PageHeader` (custom) with `Plus` action button.
- **Modals**: `Dialog`, `DialogContent`, `DialogHeader`, and `DialogTitle` for both creation and editing states.
- **Form Logic**: `react-hook-form` integrated with `Input`, `Label`, and `Select` components for robust validation and state management.
- **Data Display**: `Table` components with a `group` hover effect for row-level highlighting.
- **Interactive Elements**:
  - `DropdownMenu` for row actions (Edit, Reset Password, Deactivate).
  - `Badge` for status and role visualization using a curated color palette (Emerald for Active, Rose for Inactive).
  - `Lucide-React` icons for all actions to enhance cognitive recognition.

### Core Shadcn Components Used:
To maintain consistent design and accessibility, the `UserForm` strictly utilizes the following **Shadcn UI** primitives:

- **`Button`**: Used for the "Cancel" and "Create/Update" actions. Styled with variants like `outline` for secondary actions.
- **`Input`**: Standardized for Full Name and Email fields, supporting type-specific validation (e.g., `type="email"`).
- **`Label`**: Used to provide semantic, accessible descriptions for every form input.
- **`Select`**: A complex set of primitives (`SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`) used for Role and Status selection, ensuring a consistent custom-styled dropdown experience across all browsers.

### Component Props: `UserForm`
The `UserForm` component is designed for high reusability between creation and update flows. It accepts the following props:

- **`initialData`**: 
  - *Type*: `any` or `UserObject`.
  - *Purpose*: When provided, the form populates with existing data and switches to "Update" mode. If null, it initializes as a "Create" form with default values.
- **`onSuccess`**: 
  - *Type*: `() => void`.
  - *Purpose*: A callback executed after the server successfully saves the data. This is typically used to close the parent dialog and trigger a data refetch.
- **`onCancel`**: 
  - *Type*: `() => void`.
  - *Purpose*: A callback executed when the "Cancel" button is clicked. It ensures the parent dialog state is reset without any side effects.

### Implementation Example:
```tsx
<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
  <DialogContent className="sm:max-w-[700px] bg-card/95 backdrop-blur-lg border-none shadow-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold">
        {editingUser ? "Edit User Account" : "Create New User Account"}
      </DialogTitle>
    </DialogHeader>
    <UserForm 
      initialData={editingUser} 
      onSuccess={() => setIsFormOpen(false)} 
      onCancel={() => setIsFormOpen(false)} 
    />
  </DialogContent>
</Dialog>
```
## 8. Destructive Actions (Confirmation)
- **Component**: Always use `AlertDialog` from `@/components/ui/alert-dialog` instead of `window.confirm`.
- **Styles**:
  - **Content**: `bg-card/95 backdrop-blur-xl border-none shadow-2xl rounded-3xl`.
  - **Header**: Use `font-black uppercase tracking-tighter` for the title.
  - **Description**: Explicitly state that the action is permanent and mention what data will be lost (e.g., "associated documents").
- **Buttons**:
  - **Cancel**: Standard `AlertDialogCancel` with `rounded-xl` and `font-bold`.
  - **Action**: Use `bg-rose-500 hover:bg-rose-600 text-white` for the primary destructive action, with `shadow-lg shadow-rose-200`.
- **States**: Show a "Deleting..." state if the mutation is pending.


<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] bg-card/95 backdrop-blur-lg border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{editingUser ? "Edit User Account" : "Create New User Account"}</DialogTitle>
          </DialogHeader>
          <UserForm 
            initialData={editingUser} 
            onSuccess={() => setIsFormOpen(false)} 
            onCancel={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
