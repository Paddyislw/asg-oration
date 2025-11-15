# PDF Generation Prompt for BCA Synopsis

Copy and paste this entire prompt to an AI tool that can generate PDFs (like Claude with artifacts, ChatGPT with plugins, or document generation tools):

---

## PROMPT START

I need you to convert the following BCA Project Synopsis from Markdown to a beautifully formatted, professional PDF document following these exact specifications:

### FORMATTING REQUIREMENTS (Mandatory BCA Guidelines)

**Page Setup:**
- Paper Size: A4 (210mm × 297mm)
- Orientation: Portrait
- Top Margin: 1 inch (2.54 cm)
- Bottom Margin: 1 inch (2.54 cm)
- Left Margin: 1.5 inches (3.81 cm)
- Right Margin: 1 inch (2.54 cm)

**Typography:**
- Primary Font: Times New Roman
- Chapter Titles (e.g., "1. INTRODUCTION"): 16pt, Bold, ALL CAPS
- Section Headings (e.g., "1.1 Introduction"): 14pt, Bold
- Sub-section Headings: 12pt, Bold
- Body Text: 12pt, Regular
- Line Spacing: 1.5 lines
- Text Alignment: Justified (except headings)
- Paragraph Spacing: 6pt after each paragraph

**Page Numbering:**
- Position: Bottom center
- Font: Times New Roman, 12pt
- Format: Plain numbers (1, 2, 3...)
- Start: From page 1 (after cover page)

**Colors & Design:**
- Primary Color: #1e40af (Professional Blue) for headings
- Secondary Color: #64748b (Slate Gray) for subheadings
- Accent Color: #0ea5e9 (Sky Blue) for highlights
- Background: White (#FFFFFF)
- Text Color: #1f2937 (Dark Gray) for better readability

**Professional Touches:**
- Add subtle background watermark "Uttaranchal University" (very light, ~5% opacity)
- Include decorative horizontal lines under major headings (1pt, primary color)
- Use subtle shadows for tables and code blocks
- Add page borders (optional, very subtle)

### COVER PAGE DESIGN

Create an elegant cover page with:

1. **Top Section (University Branding):**
   - University name: "UTTARANCHAL UNIVERSITY, DEHRADUN"
   - Font: 18pt, Bold, Primary Blue Color
   - Add a decorative line underneath (2pt)

2. **Middle Section (Project Title):**
   - "Synopsis"
   - "On"
   - **"ASG-ORATION: AI-POWERED CAREER COUNSELING PLATFORM"**
   - Font: 24pt, Bold, Center-aligned
   - Add a subtle rectangular border around the title

3. **Submission Details:**
   - "Submitted to the Uttaranchal University in partial fulfilment of the requirements for the award of the Degree of"
   - **"BACHELOR OF COMPUTER APPLICATIONS"**
   - Font: 14pt, Italic for first line, Bold for degree name

4. **Student & Guide Information:**
   ```
   Submitted by
   [Student Name]
   (Learner ID: [Your Learner ID])

   Under the Guidance of
   [Guide Name with Designation] (Faculty Guide)
   ```
   - Font: 14pt, Center-aligned
   - Add spacing between sections

5. **Footer:**
   - University name again at bottom
   - Current year
   - Font: 12pt, Center-aligned

### TABLE OF CONTENTS STYLING

- Auto-generate with clickable links
- Leader dots between title and page number
- Indent sub-sections
- Font: 12pt Times New Roman
- Add "Table of Contents" heading (16pt, Bold, Centered)
- Page numbers right-aligned

### TABLES STYLING

For all tables in the document:
- Border: 1pt solid #cbd5e1
- Header Row:
  - Background: Primary Blue (#1e40af)
  - Text: White
  - Font: 12pt Bold
- Alternate Row Colors:
  - Even rows: White
  - Odd rows: #f8fafc (very light gray)
- Cell Padding: 8px
- Text Alignment: Left for text, Right for numbers
- Add subtle shadow: 0 1px 3px rgba(0,0,0,0.1)

### CODE BLOCKS & TECHNICAL CONTENT

For code snippets and technical content:
- Font: Courier New or Consolas, 11pt
- Background: #f1f5f9 (light gray)
- Border: 1px solid #cbd5e1
- Border Radius: 4px
- Padding: 12px
- Preserve formatting and indentation

### DIAGRAMS & CHARTS

For ASCII diagrams (DFDs, ER Diagrams, Class Diagrams):
- Convert to professional vector graphics if possible
- OR preserve as-is with:
  - Font: Courier New, 10pt
  - Background: White
  - Border: 1px solid #e2e8f0
  - Padding: 16px
  - Center-align on page
- Add captions below each diagram:
  - Format: "Figure X: Description"
  - Font: 11pt, Italic, Centered
  - Spacing: 6pt above, 12pt below

### GANTT CHART ENHANCEMENT

If possible, render the Gantt chart as:
- Professional timeline visualization
- Use color coding for different phases:
  - Planning: Blue
  - Development: Green
  - Testing: Orange
  - Deployment: Purple
- Add grid lines for weeks
- Label axes clearly

### BIBLIOGRAPHY FORMATTING

- Hanging indent: 0.5 inch
- Single spacing within entries
- Double spacing between entries
- Font: 12pt Times New Roman
- Alphabetically ordered
- Use proper citation format (APA/MLA)

### HEADER & FOOTER (Except Cover Page)

**Header (Optional):**
- Left: "BCA Project Synopsis"
- Right: "ASG-Oration Platform"
- Font: 10pt, Italic, Light Gray
- Border: 0.5pt line below

**Footer:**
- Center: Page number
- Font: 12pt, Times New Roman

### SECTION BREAKS

Add page breaks before:
- Each major chapter (1, 2, 3, etc.)
- Table of Contents
- Bibliography

### ADDITIONAL BEAUTIFICATION

1. **Drop Caps:** Use drop cap for first letter of Introduction section
2. **Pull Quotes:** Highlight key objectives with subtle background boxes
3. **Icons:** Add small, professional icons next to module names (optional)
4. **Color Accents:** Use primary color sparingly for emphasis
5. **White Space:** Ensure adequate margins and spacing for readability
6. **Professional Shadows:** Subtle shadows on tables, diagrams, and boxes
7. **Gradient Accents:** Very subtle gradients in headers (optional)

### QUALITY CHECKLIST

Before finalizing, ensure:
- [ ] All pages are A4 size
- [ ] Margins are exact (1", 1", 1.5", 1")
- [ ] Font is Times New Roman throughout (except code)
- [ ] Line spacing is 1.5
- [ ] Page numbers are centered at bottom
- [ ] All tables have captions
- [ ] All figures have captions
- [ ] Table of Contents is accurate
- [ ] No orphan/widow lines
- [ ] Consistent heading hierarchy
- [ ] Professional color scheme
- [ ] All sections properly aligned
- [ ] No formatting errors
- [ ] Document is 10-15 pages total

### MARKDOWN CONTENT TO CONVERT

```markdown
[PASTE THE ENTIRE CONTENT OF BCA_PROJECT_SYNOPSIS.md HERE]
```

### OUTPUT REQUIREMENTS

Generate a PDF that:
1. **Strictly adheres** to BCA formatting guidelines
2. **Looks professional** and academic
3. **Is print-ready** at 300 DPI
4. **Includes bookmarks** for navigation (in PDF)
5. **Has proper metadata** (title, author, subject)
6. **Is accessible** (tagged PDF if possible)
7. **File size** optimized (under 5 MB)

### TOOLS YOU CAN USE

You may use any of these approaches:
- LaTeX with custom template
- HTML/CSS to PDF conversion
- Markdown to PDF with Pandoc
- Direct PDF generation libraries
- Professional document generation tools

### PDF METADATA

Set the following metadata:
```
Title: BCA Project Synopsis - ASG-Oration Platform
Author: [Student Name]
Subject: Bachelor of Computer Applications Project
Keywords: BCA, Project, Synopsis, AI, Career Counseling, Next.js
Creator: [Tool Name]
```

### SPECIAL INSTRUCTIONS

1. **Preserve all technical accuracy** - don't modify code or technical terms
2. **Maintain academic tone** - professional and formal
3. **Ensure readability** - good contrast, clear fonts
4. **Print test** - document should look good both on screen and printed
5. **Accessibility** - ensure text can be selected and searched

## PROMPT END

---

# How to Use This Prompt

## Option 1: Use with Claude (Recommended)

1. Go to https://claude.ai
2. Start a new conversation
3. Copy the entire prompt above
4. Replace `[PASTE THE ENTIRE CONTENT OF BCA_PROJECT_SYNOPSIS.md HERE]` with the actual content
5. Ask Claude to generate the PDF
6. Claude will create it as an artifact you can download

## Option 2: Use with Specialized PDF Tools

### A. Using Pandoc (Command Line - Free & Powerful)

Create a file named `generate_pdf.sh`:

```bash
#!/bin/bash

# Install Pandoc first:
# Ubuntu/Debian: sudo apt-get install pandoc texlive-xetex
# macOS: brew install pandoc basictex
# Windows: Download from https://pandoc.org/installing.html

pandoc BCA_PROJECT_SYNOPSIS.md \
  -o BCA_PROJECT_SYNOPSIS.pdf \
  --pdf-engine=xelatex \
  --toc \
  --toc-depth=3 \
  --number-sections \
  -V documentclass=report \
  -V papersize=a4 \
  -V geometry:"top=2.54cm, bottom=2.54cm, left=3.81cm, right=2.54cm" \
  -V fontsize=12pt \
  -V mainfont="Times New Roman" \
  -V linestretch=1.5 \
  -V colorlinks=true \
  -V linkcolor=blue \
  -V urlcolor=blue \
  --highlight-style=tango \
  --metadata title="BCA Project Synopsis - ASG-Oration" \
  --metadata author="[Student Name]" \
  --metadata date="$(date +'%B %Y')"

echo "PDF generated: BCA_PROJECT_SYNOPSIS.pdf"
```

Then run:
```bash
chmod +x generate_pdf.sh
./generate_pdf.sh
```

### B. Using Markdown to PDF Online Tools

**Recommended Tools:**

1. **Markdown PDF** (VS Code Extension)
   - Install extension in VS Code
   - Open BCA_PROJECT_SYNOPSIS.md
   - Right-click → "Markdown PDF: Export (pdf)"
   - Customize with settings.json

2. **CloudConvert** (https://cloudconvert.com/md-to-pdf)
   - Upload BCA_PROJECT_SYNOPSIS.md
   - Configure options
   - Download PDF
   - Limited customization

3. **Markdown2PDF** (https://www.markdown2pdf.com/)
   - Simple online converter
   - Upload and download
   - Basic formatting

### C. Using LaTeX Template (Most Professional)

Create `synopsis.tex`:

```latex
\documentclass[12pt,a4paper]{report}

% Packages
\usepackage[utf8]{inputenc}
\usepackage[top=2.54cm, bottom=2.54cm, left=3.81cm, right=2.54cm]{geometry}
\usepackage{times}
\usepackage{setspace}
\usepackage{graphicx}
\usepackage{xcolor}
\usepackage{fancyhdr}
\usepackage{titlesec}
\usepackage{tocloft}
\usepackage{hyperref}

% Colors
\definecolor{primaryblue}{RGB}{30,64,175}
\definecolor{secondarygray}{RGB}{100,116,139}

% Line spacing
\onehalfspacing

% Header/Footer
\pagestyle{fancy}
\fancyhf{}
\fancyfoot[C]{\thepage}
\renewcommand{\headrulewidth}{0pt}

% Chapter formatting
\titleformat{\chapter}[display]
  {\normalfont\huge\bfseries\color{primaryblue}}
  {\chaptertitlename\ \thechapter}{20pt}{\Huge}

% Section formatting
\titleformat{\section}
  {\normalfont\Large\bfseries\color{primaryblue}}
  {\thesection}{1em}{}

% Hyperlinks
\hypersetup{
    colorlinks=true,
    linkcolor=primaryblue,
    urlcolor=blue,
    pdftitle={BCA Project Synopsis - ASG-Oration},
    pdfauthor={[Student Name]},
}

\begin{document}

% Cover Page
\begin{titlepage}
    \centering
    \vspace*{1cm}

    {\LARGE\bfseries UTTARANCHAL UNIVERSITY, DEHRADUN\par}
    \vspace{1cm}
    \rule{\textwidth}{1pt}
    \vspace{1cm}

    {\Huge\bfseries Synopsis\par}
    \vspace{0.5cm}
    {\Large On\par}
    \vspace{0.5cm}
    {\Huge\bfseries\color{primaryblue} ASG-ORATION: AI-POWERED CAREER COUNSELING PLATFORM\par}
    \vspace{2cm}

    {\large Submitted to the Uttaranchal University in partial fulfilment of the\\
    requirements for the award of the Degree of\par}
    \vspace{0.5cm}
    {\LARGE\bfseries BACHELOR OF COMPUTER APPLICATIONS\par}
    \vspace{2cm}

    {\large\bfseries Submitted by\par}
    {\large [Student Name]\par}
    {\large (Learner ID: [Your Learner ID])\par}
    \vspace{1cm}

    {\large\bfseries Under the Guidance of\par}
    {\large [Guide Name with Designation] (Faculty Guide)\par}
    \vfill

    {\large UTTARANCHAL UNIVERSITY, DEHRADUN\par}
    {\large \the\year\par}
\end{titlepage}

% Table of Contents
\tableofcontents
\newpage

% Include content here or use \input{chapters/introduction.tex}

\end{document}
```

Compile with:
```bash
xelatex synopsis.tex
xelatex synopsis.tex  # Run twice for TOC
```

## Option 3: Use Python Script (Automated)

```python
#!/usr/bin/env python3
"""
Professional PDF Generator for BCA Synopsis
Converts Markdown to beautifully formatted PDF
"""

from markdown import markdown
from weasyprint import HTML, CSS
from pathlib import Path

def generate_pdf(input_md: str, output_pdf: str):
    """Generate professional PDF from Markdown"""

    # Read Markdown content
    with open(input_md, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Convert to HTML
    html_content = markdown(md_content, extensions=[
        'tables',
        'fenced_code',
        'codehilite',
        'toc'
    ])

    # Professional CSS
    css_styles = """
    @page {
        size: A4;
        margin: 2.54cm 2.54cm 2.54cm 3.81cm;

        @bottom-center {
            content: counter(page);
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
        }
    }

    body {
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 1.5;
        color: #1f2937;
        text-align: justify;
    }

    h1 {
        font-size: 16pt;
        font-weight: bold;
        color: #1e40af;
        text-transform: uppercase;
        page-break-before: always;
        border-bottom: 2px solid #1e40af;
        padding-bottom: 8px;
        margin-top: 0;
    }

    h2 {
        font-size: 14pt;
        font-weight: bold;
        color: #1e40af;
        margin-top: 18pt;
    }

    h3 {
        font-size: 12pt;
        font-weight: bold;
        color: #64748b;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin: 12pt 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    th {
        background-color: #1e40af;
        color: white;
        padding: 8px;
        text-align: left;
        font-weight: bold;
    }

    td {
        padding: 8px;
        border: 1px solid #cbd5e1;
    }

    tr:nth-child(even) {
        background-color: #f8fafc;
    }

    code {
        font-family: 'Courier New', monospace;
        font-size: 11pt;
        background-color: #f1f5f9;
        padding: 2px 4px;
        border-radius: 3px;
    }

    pre {
        background-color: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 12px;
        overflow-x: auto;
    }

    pre code {
        background-color: transparent;
        padding: 0;
    }

    .toc {
        page-break-after: always;
    }
    """

    # Create full HTML document
    html_full = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>BCA Project Synopsis - ASG-Oration</title>
        <style>{css_styles}</style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """

    # Generate PDF
    HTML(string=html_full).write_pdf(
        output_pdf,
        stylesheets=[CSS(string=css_styles)]
    )

    print(f"✅ PDF generated successfully: {output_pdf}")

if __name__ == "__main__":
    generate_pdf(
        input_md="BCA_PROJECT_SYNOPSIS.md",
        output_pdf="BCA_PROJECT_SYNOPSIS.pdf"
    )
```

Install dependencies:
```bash
pip install markdown weasyprint pygments
```

Run:
```bash
python3 generate_pdf.py
```

## Quick Comparison

| Method | Ease of Use | Quality | Customization | Cost |
|--------|-------------|---------|---------------|------|
| Claude AI | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Free (with limits) |
| Pandoc | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free |
| Python Script | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free |
| LaTeX | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Free |
| Online Tools | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | Free/Paid |
| MS Word | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Paid |

## Recommended Workflow

**For Best Results:**

1. **Quick Preview**: Use online tool first to see basic output
2. **Professional Version**: Use Pandoc or Python script with custom CSS
3. **Final Polish**: Import into MS Word for any manual adjustments
4. **Export Final PDF**: From Word with "Save as PDF" (high quality)

---

**Need Help?** Choose the method that best fits your technical comfort level!
