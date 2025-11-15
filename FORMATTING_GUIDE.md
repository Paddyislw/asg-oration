# BCA Synopsis Formatting Guide

## Quick Start

Your synopsis document has been created as `BCA_PROJECT_SYNOPSIS.md`. Follow these steps to format it according to BCA guidelines:

## Option 1: Using Microsoft Word (Recommended)

### Step 1: Convert Markdown to Word
1. Open Microsoft Word
2. Go to **File > Open**
3. Select `BCA_PROJECT_SYNOPSIS.md`
4. Word will automatically convert the Markdown formatting

### Step 2: Apply BCA Formatting Requirements

#### Page Setup
1. **Paper Size**: Go to **Layout > Size > A4**
2. **Margins**: Go to **Layout > Margins > Custom Margins**
   - Top: 1" (2.54 cm)
   - Bottom: 1" (2.54 cm)
   - Left: 1.5" (3.81 cm)
   - Right: 1" (2.54 cm)

#### Font Formatting
1. Select all text (Ctrl+A)
2. Set font to **Times New Roman**
3. Apply font sizes:
   - **Chapter Titles** (e.g., "1. INTRODUCTION"): 16 pt, Bold
   - **Section Headings** (e.g., "1.1 Introduction"): 14 pt, Bold
   - **Body Text**: 12 pt, Regular
   - **Table Content**: 12 pt

#### Line Spacing
1. Select all text (Ctrl+A)
2. Go to **Home > Line Spacing**
3. Select **1.5 lines**

#### Page Numbers
1. Go to **Insert > Page Number**
2. Select **Bottom of Page > Plain Number 2** (centered)
3. Format to start from page 1

#### Table of Contents
1. Place cursor after the Table of Contents heading
2. Go to **References > Table of Contents > Custom Table of Contents**
3. Set levels to 2
4. Click **OK**
5. Update the table by right-clicking and selecting "Update Field"

### Step 3: Format Tables
1. For each table:
   - Select the table
   - Go to **Table Design**
   - Apply **Grid Table 4 - Accent 1** style
   - Ensure borders are visible

### Step 4: Format Diagrams
The diagrams are in ASCII art format. You can:
1. **Keep as-is**: Use Courier New font for diagram sections to maintain alignment
2. **Create proper diagrams**: Use tools like:
   - **Draw.io** (https://app.diagrams.net) - Free
   - **Lucidchart** (https://www.lucidchart.com) - Free tier available
   - **Microsoft Visio** - For professional diagrams
   - **PlantUML** - For generating diagrams from text

### Step 5: Add Figure and Table Captions
1. Click on each diagram/table
2. Go to **References > Insert Caption**
3. Select **Figure** or **Table**
4. Add descriptive caption
5. Click **OK**

### Step 6: Cover Page
1. Format the cover page section with:
   - Title: 24 pt, Bold, Centered
   - Subtitle: 16 pt, Centered
   - Student Name: 14 pt, Centered
   - Guide Name: 14 pt, Centered
   - University Name: 14 pt, Bold, Centered
2. Add university logo if available

### Step 7: Final Review
- Check that all headings are properly formatted
- Ensure page numbers are correct
- Verify table of contents is accurate
- Check that all tables and figures have captions
- Proofread for spelling and grammar

### Step 8: Save as Word Document
1. Go to **File > Save As**
2. Choose location
3. File name: `BCA_PROJECT_SYNOPSIS_[YourName].docx`
4. Format: **Word Document (.docx)**
5. Click **Save**

---

## Option 2: Using Google Docs (Free Alternative)

1. Open Google Docs (https://docs.google.com)
2. Create a new document
3. Copy content from `BCA_PROJECT_SYNOPSIS.md`
4. Paste into Google Docs
5. Apply formatting using similar steps as Word:
   - **File > Page setup** for margins and size
   - Use toolbar for fonts and sizes
   - **Insert > Page numbers** for numbering
   - **Insert > Table of contents** for auto-generated TOC

---

## Option 3: Using Pandoc (Advanced)

If you have Pandoc installed:

```bash
pandoc BCA_PROJECT_SYNOPSIS.md -o BCA_PROJECT_SYNOPSIS.docx \
  --reference-doc=template.docx \
  --toc \
  --number-sections
```

Then open in Word and fine-tune formatting.

---

## Customization Required

Before submission, **update these placeholders** in the document:

1. **[Student Name]** - Replace with your full name
2. **[Your Learner ID]** - Replace with your BCA learner ID
3. **[Guide Name with Designation]** - Replace with your project guide's name and designation
4. **[Current Date]** - Replace with the current date

### Where to Find These Placeholders
- Cover page (page 1)
- Last page (document prepared by section)
- Top of document in submission details

---

## Creating Professional Diagrams

### DFD (Data Flow Diagram)
**Recommended Tool**: Draw.io
1. Visit https://app.diagrams.net
2. Choose **Blank Diagram**
3. Use shapes from **Software** section
4. Create Context Diagram (Level 0)
5. Create Level 1 DFD
6. Create Level 2 DFD
7. Export as PNG (File > Export as > PNG)
8. Insert into Word document

### ER Diagram (Entity-Relationship)
**Recommended Tool**: dbdiagram.io or Draw.io
1. Visit https://dbdiagram.io
2. Use DBML syntax or visual editor
3. Define entities: User, ChatSession, ChatMessage
4. Add relationships with cardinality
5. Export as PNG
6. Insert into Word document

### Class Diagram
**Recommended Tool**: PlantUML or Draw.io
1. For PlantUML:
   ```
   @startuml
   class User {
     +id: string
     +email: string
     +getChatSessions()
   }
   class ChatSession {
     +id: string
     +title: string
   }
   User "1" --> "*" ChatSession
   @enduml
   ```
2. Generate at http://www.plantuml.com/plantuml
3. Download PNG
4. Insert into Word

### Gantt Chart
**Recommended Tool**: Excel or ProjectLibre
1. Use Microsoft Excel with Gantt chart template
2. Or download ProjectLibre (free): https://www.projectlibre.com
3. Create timeline with tasks
4. Export as image
5. Insert into Word

### PERT Chart
**Recommended Tool**: Lucidchart or Draw.io
1. Create network diagram with nodes and arrows
2. Label activities and durations
3. Highlight critical path in red
4. Export as PNG
5. Insert into Word

---

## Quality Checklist

Before submission, verify:

- [ ] Document is on A4 size paper
- [ ] Font is Times New Roman throughout
- [ ] Font sizes: 12 (text), 14 (headings), 16 (chapter titles)
- [ ] Margins: 1" top/bottom/right, 1.5" left
- [ ] Line spacing is 1.5 throughout
- [ ] Page numbers at bottom center
- [ ] All tables have captions with table numbers
- [ ] All figures have captions with figure numbers
- [ ] Table of Contents is accurate and updated
- [ ] All placeholders replaced with actual information
- [ ] Cover page properly formatted
- [ ] Bibliography in proper format
- [ ] Document is 10-12 pages (currently ~19 pages in Markdown)
- [ ] All diagrams are clear and professional
- [ ] No spelling or grammar errors
- [ ] Consistent formatting throughout

---

## Print Settings (When Ready)

For final printing:
1. Use **Print Preview** to verify formatting
2. Print on **A4 white paper (80 GSM)**
3. Print **single-sided** unless specified otherwise
4. Consider **binding** (spiral or thermal binding)
5. Include **project guide declaration** as per university format

---

## Need Help?

If you encounter issues:
1. Refer to your university's synopsis format sample (if provided)
2. Consult your project guide for specific formatting requirements
3. Use Word's **Help** feature (F1) for formatting questions
4. Check university website for detailed guidelines

---

## Additional Resources

### Free Diagramming Tools
- **Draw.io**: https://app.diagrams.net
- **PlantUML**: http://www.plantuml.com
- **dbdiagram.io**: https://dbdiagram.io
- **Mermaid Live**: https://mermaid.live

### Document Templates
- Check your university portal for official BCA synopsis templates
- Microsoft Office templates: https://templates.office.com

### Citation Tools
- **Citation Machine**: https://www.citationmachine.net
- **BibMe**: https://www.bibme.org

---

**Document Last Updated**: Generated with ASG-Oration synopsis
**Format Compliance**: BCA Project Guidelines (Uttaranchal University)
