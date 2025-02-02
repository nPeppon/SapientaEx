# TECHNICAL REPORT FOR THE WEB PLATFORM FOR PROJECT AND QUOTE MANAGEMENT  
**Version:** 1.0

## 1. INTRODUCTION
The described web platform aims to simplify and centralize the entire process of creating and managing industrial plant projects and related commercial quotes. Its functionalities include:

- Definition and management of Families, Categories, and Plant Nodes.
- Creation and modification of projects (logical flow chart and 2D layout), with the ability to automatically define production costs and times.
- Generation of complete quotes, with automated calculation of costs and prices.
- The possibility to convert a project into a work order (commessa) and upload the bill of materials (BOM) along with associated documents (manuals, certificates, etc.).
- Integration with a LLM (Large Language Model) to accelerate the definition and customization of nodes, as well as the creation of projects starting from a simple textual description.
- Dedicated exports (to Compunet software and in PDF, Word, XLS formats).

Thanks to these tools, the platform aspires to become an agile, customizable, and innovative environment capable of covering the entire life cycle of a project/work order: from the design and quotation phase to the implementation and final delivery.

## 2. PROJECT STRUCTURE
The application is based on a modular structure that allows you to:

- Create and manage Families, Categories, and Nodes.
- Dynamically configure parameters and cost/time formulas.
- Design plants with a visual node approach (flow chart) to represent the plant’s logical flow.
- Generate 2D plant layouts, with different views (top, side, front, etc.).
- Centralize customer data management (similar to a CRM).
- Produce commercial quotes with automatic price and processing time calculations.
- Convert a project into a work order and attach the bill of materials and technical documents.
- Export data to external systems (e.g., Compunet, PDF, Word, XLS).

The high level of customization is achieved through the use of dynamic fields and logical formulas (even referencing external tables, such as the cost of carpentry). The integration with the LLM engine allows for the generation of projects from simple text inputs and the creation of node/project templates much more efficiently.

## 3. NODES AND THEIR DEFINITION

### 3.1 Concept of Node
A node is the basic element of the plant (for example, a Mixer MAV 0.25). It is identified by a specific code, such as `MX.VM.02.01`, where:
- **MX** = Family code (Mixer)
- **VM** = sub-category or type (Vertical Mixer)
- **02.01** = unique identifier of the node (size or specific model)

### 3.2 Node Fields
Each node has:
- **Default fields:** Name, Cost, Family, Type, Photo, etc.
- **Dynamic fields:** Defined as needed on a case-by-case basis. They can be of various types (text, numerical, list, image, checkbox, etc.) and have specific logic (option, variant, modifiable/non-modifiable, etc.).
- **Formula fields:** Allow calculation (using JavaScript code or LLM prompt) of costs or processing times based on other fields within the same node or external tables (e.g., carpentry costs).

Dynamic fields increase flexibility in node definition. For example, if a node represents a 0.25 Mixer, you can add fields such as capacity in liters, motor power, or enable options (color, type of coating, etc.).

## 4. FAMILIES, CATEGORIES, AND NODES
The platform provides the user with a dedicated menu to autonomously define:

### Families
- **Name**
- **Code**
- **Description**

### Categories (belonging to a Family)
- **Name**
- **Code**
- **Description**
- **Reference Family Code**
- **2D image for layout (if available)**

### Nodes (belonging to a Category)
- **Basic structure** (default fields)
- **Dynamic fields, options, formulas, etc.**

## 5. MANAGEMENT OF CARPENTRY COSTS
Alongside nodes, there is a user-definable table for carpentry costs (e.g., cost of iron per kg, galvanizing, painting, etc.). Each cost:
- Has a name, code, and description.
- Has a unit of measure (€/kg, €/m², €/m, etc.).

In the node’s formula field, you can refer to these costs for more precise and realistic calculations (for example: total cost = (iron weight) × (iron cost per kg) + (surface area) × (galvanizing cost per m²)).

## 6. CUSTOMER DATA (ANAGRAPHIC)
There is a dedicated section for managing customer data (similar to a CRM). Here, the user can:
- Insert/update customer company details.
- Define various contacts for each company.
- Keep a summary of projects and quotes made (with an indication of which projects have become work orders).

## 7. PROJECT STRUCTURE

### 7.1 Creating a Project
A project can be created:
- **From scratch:** The user adds one or more nodes and defines the plant flow.
- **From a template:** Selected from a predefined library.

### 7.2 Text-to-Project Functionality (LLM)
The platform integrates an LLM that, based on a textual (or voice) description, is capable of:
- Suggesting or automatically generating a plant project.
- Populating the canvas with nodes and connections.

### 7.3 Canvas and Logical Flow Chart
The heart of the application is a canvas (supported by libraries such as Joint.js or React Flow) where the user can:
- Drag & drop available catalog nodes.
- Connect various nodes (creating flow relationships).
- Delete nodes or connections.
- Modify node fields.
- Create project revisions to keep track of changes (with possible rollback).

### 7.4 Project Nodes
When a node is dragged onto the canvas, a project node is instantiated, inheriting all fields and values from the “original” node. The user then goes through a wizard to:
- Verify/update the fields and values.
- Select variants (fields with multiple possible values).
- Choose options (like optional features on a car).

Once inserted, the node can still be customized (field modifications, adding new fields, etc.). If the node is modified relative to the standard, it assumes a “custom” state (field `is_custom`), but still maintains a reference to the source node.

## 8. QUOTE GENERATION AND WORKFLOW
At any time, a quote can be generated from the project. The workflow is as follows:

- **Quote Creation:** Define standard surcharge parameters (margins) or custom ones.
- **Quote Calculation:**  
  For each node, the platform calculates:
  - **Production time:** Using the node’s “processing time” formula.
  - **Cost:** Using the cost formula, which can include carpentry costs.
  - **Customer price:** Cost × surcharge parameters.
  - It reports the total cost and price for the entire project and the overall production time.
- **Quote Export:** The user can save the quote and, if desired, export it in PDF, Word, or XLS format. It is also possible to choose whether to show the details of each node or only the total.
- **Quote History:** Each project can have multiple quotes to track different versions and changes.

## 9. CONVERSION INTO WORK ORDER
If the customer confirms the order, the project is marked as a work order:
- A quote number is assigned.
- The work order code can be defined at a later stage.

## 10. PROJECT LAYOUT VIEW
In addition to the “logical flow chart” view, it is possible to switch to a 2D view (plant layout) where the nodes are positioned according to a technical drawing logic.
- It is possible to define multiple plant layouts (top view, front, side, rear, etc.).
- Each layout can be saved in different revisions.
- It can be exported in PDF or JPG, useful for documentation or the workshop.

## 11. EXPORT TO COMPUNET
The platform includes a specific function to generate a file compatible with Compunet software, in order to facilitate the creation of the plant’s software. In this way, the transfer of information from the design phase to programming becomes more streamlined and less prone to errors.

## 12. RECONCILIATION WITH THE BILL OF MATERIALS AND DOCUMENTS

### 12.1 Bill of Materials
Once the work order is completed, an Excel file containing the bill of materials (BOM) can be uploaded, with:
- The node code on each row.
- An indication “spare part: yes/no.”

This way, the system automatically associates the real components to each project node and produces an ordered list of spare parts.

### 12.2 Documents
In post-production, the user can:
- Attach manuals or other technical documents to individual nodes.
- Attach the general plant manual to the project.
  
This structure allows having all related documentation in a single digital archive.

### 12.3 Future ERP Developments
The future goal is to leverage the work order history to generate a draft bill of materials already during the quotation phase. However, due to “dirty” or inconsistent historical data, it has been decided for now not to fully automate this process. Once the data have been cleaned and standardized, the platform could evolve into a form of ERP dedicated to design and production.

---

# WEBAPP STRUCTURE
Below is an overview of the main pages (or views) that the webapp will offer along with their related functionalities. The goal is to provide a clear schema of how the user will interact with the application.

The webapp is therefore composed of well-organized pages and functionalities to cover the entire workflow: from the definition of catalogs (Families, Categories, Nodes) and carpentry costs, to advanced design (Flow Chart and 2D Layout), up to quote creation, work order management, BOM upload, and finally data export. Each page is designed to be intuitive, modular, and scalable to adapt to user needs and integrate seamlessly with external systems such as Compunet or potential ERP systems.

## 1. Dashboard / Home Page
**Functionalities:**
- Quick view of key information and statistics (number of ongoing projects, quotes nearing expiration, active work orders, etc.).
- Fast access to main sections (Projects, Quotes, Customers, etc.).
- Possibility to view a list of notifications or recent activities (e.g., latest quotes created, new projects started, work order updates).

## 2. Customer Data Management
**Customer List:**
- View of the list of existing customers with main fields (company name, contact person, status, etc.).
- Possibility to search and filter customers (by name, industry, etc.).

**Create/Edit Customer:**
- Form to input company data (name, address, VAT number, contacts, etc.).
- Section to define the main contacts (name, email, role, phone).
- Overview of projects and quotes related to that customer (quick view).
- Possibility to set notes or attach specific documents for the customer.

## 3. Management of Families, Categories, and Nodes

### 3.1 Families Page
- **Families List:** View of created families (name, code, description).
- **Create/Edit Family:** Dedicated form to insert/update details (name, code, description).

### 3.2 Categories Page
- **Categories List:** List of all categories, with the ability to filter by associated family.
- **Create/Edit Category:** Form to insert/update name, code, description, 2D image (if available), and associate the category with a specific family.

### 3.3 Nodes Page
- **Nodes List:** Table or card view of all created nodes, indicating the associated family and category.
- **Search and Filter Options:** For code, family, category, etc.
- **Create/Edit Node:**
  - Form with:
    - **Default fields:** Name, code, base cost, photo, description, etc.
    - **Dynamic fields:** Ability to add fields of various types (text, numeric, list, checkbox, images…).
    - **Formula fields:** Area to input calculation logic (JavaScript) or LLM prompt to automatically obtain formulas.
  - **Options and Variants:** Setting fields that support multiple values (e.g., color, specific configurations, optional features).
  - Save the node with its personalized structure.

## 4. Management of Carpentry Costs
- **Costs List:** Table with all carpentry elements, for example, iron, galvanizing, painting, etc.
  - For each item, display name, code, description, unit of measure (€/kg, €/m², etc.).
- **Create/Edit Cost:** Form to define/update the data (name, code, description, unit of measure).
- **Usage in Nodes:** While editing a node, the user can directly reference carpentry costs for formulas.

## 5. Creation and Management of Projects (Flow Chart)

### Projects List:
- View of all projects, with the possibility to filter by status (draft, confirmed, archived), creation date, customer, etc.
- Access to the creation of a new project (from scratch or from a template).

### Creating a New Project:
- Possibility to choose whether to start from scratch or select a project template.
- Definition of the project name, associated customer, initial notes.
- (If available) use of Text-to-Project with LLM to automatically generate a project from a textual description.

### Canvas Page (Flow Chart):
- **Interactive Environment:** Based on libraries like Joint.js or React Flow where nodes can be dragged.
- **Sidebar or Slide-out Menu:** Listing available nodes (categorized).
- **Drag & Drop:** of nodes onto the canvas.
- **Visual Connection:** Between nodes to define the flow.
- **Configuration Wizard:** When inserting a node (to manage options, variants, dynamic fields, etc.).
- **Save and Revision Creation:** To track changes.
- **Rollback Functionality:** To previous revisions.
- **Buttons for Exporting the Diagram:** (as image, PDF, etc.) and switching to the 2D layout view.

## 6. Project Layout View (2D)
- **Layout List:** Possibility to view the different layouts saved for a given project (top view, front, side, etc.).
- **2D Layout Editor:**
  - Dedicated canvas where nodes (already present in the flow chart) are arranged in a plan or simplified perspective views.
  - Basic drawing tools (snap, grid, measurements, etc.).
  - Ability to add annotations (texts, dimensions, safety symbols, etc.).
  - Saving and revisioning of the layout with the same versioning logic as the project.
  - Exporting the layout in PDF or JPG for documentation.

## 7. Quotes
- **Quotes List:** View of all generated quotes, with status (draft, sent, accepted, etc.), customer, date, amount, etc.
  - Search and filters (by customer, status, date range).
- **Creating a New Quote:**
  - Selection of the project on which the quote is based.
  - Definition and modification of surcharge parameters (margins, discounts, etc.).
  - Automatic calculation of production times and costs (based on node formulas).
  - Generation of the final price for each node and the overall project.
  - Possibility to save the quote and generate PDF/Word/Excel.
  - Option to display or hide the cost details per node.
- **Quote Detail:**
  - View of the quote structure (list of nodes, costs, margins, and times).
  - Options to modify surcharges and generate successive versions of the quote.

## 8. Work Order and Integration with the Bill of Materials
- **Converting a Project into a Work Order:**
  - Selection of a confirmed project and assignment of a work order code.
  - Association of the corresponding quote number.
  - Possibility to add notes or accounting references (e.g., from an external ERP).
- **Uploading the Bill of Materials (Excel):**
  - Dedicated page for uploading an Excel file containing the BOM (Bill of Materials).
  - Mapping of mandatory fields (node code, spare part yes/no, etc.).
  - Automatic association of components to the corresponding project nodes.
  - Tabular view of the results with possible error signals or inconsistencies (codes not found, duplicates, etc.).
- **Attachments and Documents:**
  - Section to upload files (manuals, certificates, various documents) at the project or individual node level.
  - Ability to download or delete files if they are no longer valid.

## 9. Export to Compunet
- **Export Interface:**
  - Selection of the project or work order to export.
  - Option to choose the file format required by Compunet.
  - Generation and download of the interchange file (structure and content conforming to the Compunet standard).

## 10. Settings / User Management
- **Role and Permission Management:**
  - Definition of roles (administrator, designer, sales, etc.).
  - Configuration of permissions (e.g., who can modify nodes, who can generate quotes, etc.).
- **System Preferences:**
  - Setting global parameters (currency, languages, date and number formats, default surcharge parameters).
  - Configuration of external integrations (import/export parameters, etc.).
