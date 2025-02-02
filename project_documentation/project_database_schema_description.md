# Project Database Schema Documentation (English Standard Table Names)

This document outlines the draft database schema for the project. The schema covers tables for managing families, categories, nodes, clients, projects, offers, and additional components. The schema is designed for flexibility—using JSONB fields for dynamic data—and can be extended with triggers, versioning, and additional business logic as needed.

---

## 1. Families

The `families` table stores the basic definitions of families (or groups) of nodes.

```sql
CREATE TABLE public.families (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **name:** Name of the family.
- **code:** Unique code for the family.
- **description:** Optional description.
- **created_at / updated_at:** Timestamps for record creation and last update.

---

## 2. Categories

The `categories` table links categories to families and may include an optional image for 2D layout icons.

```sql
CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    family_id INT NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    image_2d TEXT,  -- Optional image for 2D layout icon
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **family_id:** Foreign key referencing `families(id)`.
- **name:** Category name.
- **code:** Unique code.
- **description:** Optional text description.
- **image_2d:** Optional field for an image URL used in 2D layouts.
- **created_at / updated_at:** Timestamps.

---

## 3. Nodes

The `nodes` table defines nodes that belong to categories. It includes default attributes and a JSONB column (`dynamic_data`) for storing dynamic fields and formulas.

```sql
CREATE TABLE public.nodes (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    base_cost NUMERIC(15, 2) DEFAULT 0, -- Base cost if applicable
    image_url TEXT,                     -- Main image or reference link
    dynamic_data JSONB NOT NULL DEFAULT '{}', 
    -- Example:
    -- { "fields": { "capacity_liters": 250, "motor_power_kw": 5 }, "formulas": { "cost_calculation": "..." } }
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **category_id:** Foreign key referencing `categories(id)`.
- **name:** Node name.
- **code:** Unique node code.
- **description:** Optional node description.
- **base_cost:** Base cost value.
- **image_url:** URL or reference for an image.
- **dynamic_data:** JSONB field to store additional fields and formulas.
- **created_at / updated_at:** Timestamps.

---

## 4. Carpentry Costs

The `carpentry_costs` table stores external cost references (e.g., cost of iron, zinc, painting) that can be used in node formulas.

```sql
CREATE TABLE public.carpentry_costs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    unit_of_measure TEXT NOT NULL,  -- e.g. "€/kg", "€/mq", "€/meter"
    cost NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **name:** Name of the cost element.
- **code:** Unique code.
- **description:** Optional description.
- **unit_of_measure:** Unit for cost measurement.
- **cost:** Cost value.
- **created_at / updated_at:** Timestamps.

---

## 5. Clients

The `clients` table holds customer data similar to a CRM. It supports additional information via a JSONB field.

```sql
CREATE TABLE public.clients (
    id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    vat_number TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    phone TEXT,
    email TEXT,
    additional_info JSONB NOT NULL DEFAULT '{}', -- For storing multiple contacts or notes
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **company_name:** Name of the client company.
- **vat_number:** VAT number.
- **address, city, country:** Address details.
- **phone, email:** Contact information.
- **additional_info:** JSONB field for extra data (e.g., multiple contacts, notes).
- **created_at / updated_at:** Timestamps.

---

## 6. Projects

The `projects` table stores project information and links projects to clients. Each project can reference multiple project nodes.

```sql
CREATE TABLE public.projects (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES public.clients(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',  -- e.g. 'draft', 'active', etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **client_id:** Optional foreign key linking to a client.
- **name:** Project name.
- **description:** Project description.
- **status:** Project status flag (default is 'draft').
- **created_at / updated_at:** Timestamps.

---

## 7. Project Nodes

The `project_nodes` table represents instances of a node within a specific project. It stores a reference to the original node along with any user overrides in a JSONB field.

```sql
CREATE TABLE public.project_nodes (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    node_id INT NOT NULL REFERENCES public.nodes(id) ON DELETE RESTRICT,
    is_custom BOOLEAN NOT NULL DEFAULT FALSE, -- Tracks whether the node’s data is overridden
    override_data JSONB NOT NULL DEFAULT '{}', 
    -- Example: { "fields": { "color": "red" }, "formulas": { "cost": "...custom formula..." } }
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **project_id:** Foreign key referencing `projects(id)`.
- **node_id:** Foreign key referencing `nodes(id)`.
- **is_custom:** Boolean flag indicating if data has been overridden.
- **override_data:** JSONB field for custom overrides.
- **created_at / updated_at:** Timestamps.

---

## 8. Project Layouts (Optional)

If the project requires storage of multiple 2D or graphical layouts (e.g., top view, side view), use the `project_layouts` table. This is optional if layout data is only stored on the front end.

```sql
CREATE TABLE public.project_layouts (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    layout_name TEXT NOT NULL,       -- e.g. "top_view", "side_view"
    layout_data JSONB NOT NULL DEFAULT '{}', 
    -- Example: { "nodes": [ { "id": 1, "x": 100, "y": 200 } ], "connections": [...] }
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **project_id:** Foreign key linking to the project.
- **layout_name:** Name/identifier for the layout view.
- **layout_data:** JSONB field for storing layout details (node positions, connections).
- **created_at / updated_at:** Timestamps.

---

## 9. Offers

The `offers` table contains project offers. It stores offer details along with pricing multipliers, margins, and final totals in JSONB format.

```sql
CREATE TABLE public.offers (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    offer_code TEXT,
    status TEXT DEFAULT 'draft',    -- e.g. 'draft', 'sent', 'accepted', 'rejected'
    pricing_data JSONB NOT NULL DEFAULT '{}',  -- e.g. { "markup_percentage": 25, "discount": 5, "currency": "EUR" }
    total_cost NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **project_id:** Foreign key referencing `projects(id)`.
- **offer_code:** Optional offer code.
- **status:** Offer status.
- **pricing_data:** JSONB field for pricing details.
- **total_cost / total_price:** Aggregated financial values.
- **created_at / updated_at:** Timestamps.

---

## 10. Offer Nodes (Optional)

The `offer_nodes` table allows you to freeze node data as it was at the time an offer was created. This table is optional if you prefer to recalculate values dynamically from `project_nodes`.

```sql
CREATE TABLE public.offer_nodes (
    id SERIAL PRIMARY KEY,
    offer_id INT NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
    project_node_id INT NOT NULL REFERENCES public.project_nodes(id) ON DELETE CASCADE,
    cost NUMERIC(15, 2) NOT NULL DEFAULT 0,
    price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    calculations JSONB NOT NULL DEFAULT '{}', -- Stores final cost/price breakdown and additional details
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **offer_id:** Foreign key referencing `offers(id)`.
- **project_node_id:** Foreign key referencing `project_nodes(id)`.
- **cost / price:** Financial breakdown for the node.
- **calculations:** JSONB field for storing detailed calculations.
- **created_at / updated_at:** Timestamps.

---

## 11. Work Orders (formerly "Commesse") (Optional)

The `work_orders` table can be used to mark a project as a work order. You may also add these fields to the `projects` table if preferred.

```sql
CREATE TABLE public.work_orders (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    work_order_code TEXT,
    accepted_offer_id INT REFERENCES public.offers(id) ON DELETE SET NULL,  -- Link to the accepted offer
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **project_id:** Foreign key linking to `projects(id)`.
- **work_order_code:** Code for the work order.
- **accepted_offer_id:** Optional link to the accepted offer.
- **status:** Work order status.
- **created_at / updated_at:** Timestamps.

---

## 12. Bill of Materials

The `bill_of_materials` table stores the finalized bill of materials (BOM) for each work order or project. Each record links to a work order and references the node code.

```sql
CREATE TABLE public.bill_of_materials (
    id SERIAL PRIMARY KEY,
    work_order_id INT NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
    node_code TEXT NOT NULL,           -- e.g. "MX.VM.02.01"
    is_spare_part BOOLEAN NOT NULL,
    quantity NUMERIC(15, 2) NOT NULL DEFAULT 1,
    extra_info JSONB NOT NULL DEFAULT '{}', -- Additional details or references
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Fields:**

- **id:** Primary key.
- **work_order_id:** Foreign key linking to `work_orders(id)`.
- **node_code:** The node code (e.g., "MX.VM.02.01").
- **is_spare_part:** Boolean indicating if the item is a spare part.
- **quantity:** Quantity of the item.
- **extra_info:** JSONB field for any additional information.
- **created_at / updated_at:** Timestamps.

---

## Additional Notes

1. **Dynamic Fields:**
   - Dynamic fields are stored in JSONB columns (e.g., `nodes.dynamic_data` and `project_nodes.override_data`) to allow flexible schema evolution without altering the table structure.

2. **Revisions / Versioning:**
   - For detailed version control, consider adding separate "revisions" tables or use triggers to store historical snapshots (using tools like pgAudit or a custom solution).

3. **Offers vs. Offer Nodes:**
   - The `offer_nodes` table is optional. Some implementations may choose to recalculate values from `project_nodes` each time an offer is generated, while others prefer to capture a static snapshot.

4. **Layout Data:**
   - The `project_layouts` table is optional if layout data is only maintained on the front end. However, it is useful for persisting multiple 2D/3D views or flowchart positions.

5. **Work Orders:**
   - Whether you store work orders as a separate table or as part of the `projects` table depends on your business logic and requirements.

6. **Authentication & Users:**
   - Supabase (or your chosen platform) typically manages the `auth.users` table. Additional fields (e.g., `created_by`, `updated_by`) can be added if needed.

7. **Integrations (e.g., Compunet):**
   - For exporting data, you might create custom functions or microservices to generate the required file formats from these tables.

---