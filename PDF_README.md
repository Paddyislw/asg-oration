# 📄 PDF Generation for BCA Synopsis

Quick guide to convert your BCA synopsis from Markdown to PDF.

## 🚀 Quick Start (Choose One Method)

### Method 1: Automated Script (Linux/Mac) ⭐ RECOMMENDED

```bash
# Make sure you're in the project directory
cd /home/user/asg-oration

# Run the script
./generate_pdf_simple.sh
```

### Method 2: Python Script (Cross-Platform)

```bash
# Run with Python 3
python3 generate_pdf.py
```

### Method 3: Manual Pandoc Command

```bash
pandoc BCA_PROJECT_SYNOPSIS.md -o BCA_PROJECT_SYNOPSIS.pdf \
  --pdf-engine=xelatex \
  --toc \
  -V papersize=a4 \
  -V geometry:"top=2.54cm, bottom=2.54cm, left=3.81cm, right=2.54cm" \
  -V fontsize=12pt \
  -V mainfont="Times New Roman" \
  -V linestretch=1.5
```

### Method 4: Using AI (Claude/ChatGPT)

1. Open `PDF_GENERATION_PROMPT.md`
2. Copy the entire prompt
3. Paste into Claude.ai or ChatGPT
4. Replace the placeholder with actual content from `BCA_PROJECT_SYNOPSIS.md`
5. Download the generated PDF

### Method 5: Microsoft Word (Manual but Reliable)

1. Open Microsoft Word
2. File → Open → Select `BCA_PROJECT_SYNOPSIS.md`
3. Word will convert the Markdown automatically
4. Apply formatting using `FORMATTING_GUIDE.md`
5. File → Save As → PDF

### Method 6: Online Tools (No Installation)

**Quick & Easy:**
- Visit: https://cloudconvert.com/md-to-pdf
- Upload: `BCA_PROJECT_SYNOPSIS.md`
- Download: PDF

**Other Options:**
- https://www.markdown2pdf.com/
- https://dillinger.io/ (export to PDF)
- https://stackedit.io/ (export to PDF)

## 📦 Installation Requirements

### For Scripts (Method 1 & 2):

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install pandoc texlive-xetex texlive-fonts-recommended
```

**macOS:**
```bash
brew install pandoc
brew install --cask basictex
```

**Windows:**
- Download Pandoc: https://pandoc.org/installing.html
- Download MiKTeX: https://miktex.org/download

### For Python Method (Alternative):

```bash
pip3 install markdown weasyprint
```

## 📋 Files Overview

| File | Purpose |
|------|---------|
| `BCA_PROJECT_SYNOPSIS.md` | Main synopsis content (source) |
| `generate_pdf_simple.sh` | Bash script for PDF generation |
| `generate_pdf.py` | Python script for PDF generation |
| `PDF_GENERATION_PROMPT.md` | Detailed prompt for AI tools |
| `FORMATTING_GUIDE.md` | Manual formatting instructions |
| `PDF_README.md` | This file - quick start guide |

## ✅ What You Get

The generated PDF will have:

- ✅ A4 paper size (210mm × 297mm)
- ✅ Correct margins (1", 1", 1.5", 1")
- ✅ Times New Roman font, 12pt
- ✅ 1.5 line spacing
- ✅ Page numbers at bottom center
- ✅ Professional table formatting
- ✅ Clickable table of contents
- ✅ Proper heading hierarchy
- ✅ Code blocks with syntax highlighting
- ✅ All BCA guidelines followed

## 🎨 Customization

To customize the PDF appearance, edit these parameters in the scripts:

**Colors:**
```bash
# In generate_pdf_simple.sh or PDF_GENERATION_PROMPT.md
Primary Color: #1e40af (Blue)
Secondary Color: #64748b (Gray)
```

**Fonts:**
```bash
# Change main font (if Times New Roman not available)
-V mainfont="Liberation Serif"  # Or "Georgia", "Garamond"
```

**Margins:**
```bash
# Adjust if needed
-V geometry:"top=2.54cm, bottom=2.54cm, left=3.81cm, right=2.54cm"
```

## 🔧 Troubleshooting

### Error: "pandoc: command not found"
**Solution:** Install Pandoc (see Installation Requirements above)

### Error: "xelatex not found"
**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install texlive-xetex

# macOS
brew install basictex
```

### Error: "Font 'Times New Roman' not found"
**Solution:**
```bash
# Use an alternative font
-V mainfont="Liberation Serif"

# Or install Times New Roman
# Ubuntu: sudo apt-get install ttf-mscorefonts-installer
```

### PDF looks different than expected
**Solution:**
1. Use Method 5 (Microsoft Word) for precise control
2. Or use `PDF_GENERATION_PROMPT.md` with Claude AI
3. Fine-tune manually in Word after generation

### Tables or diagrams not rendering correctly
**Solution:**
- ASCII diagrams are preserved as-is (monospace font)
- For professional diagrams, create in Draw.io and insert in Word
- See `FORMATTING_GUIDE.md` for diagram tools

## 📖 After Generation

**Before Submission:**

1. **Open and Review:**
   - Check all pages are correctly formatted
   - Verify page numbers are sequential
   - Ensure no content is cut off

2. **Update Placeholders:**
   - Find and replace `[Student Name]` → Your name
   - Find and replace `[Your Learner ID]` → Your ID
   - Find and replace `[Guide Name with Designation]` → Guide's name
   - Find and replace `[Current Date]` → Submission date

3. **Quality Check:**
   - Print a test page to verify formatting
   - Check margins are correct (measure with ruler)
   - Ensure fonts are clear and readable
   - Verify images/diagrams are visible

4. **Final Steps:**
   - Print on A4 white paper (80 GSM)
   - Consider spiral or thermal binding
   - Submit with guide's declaration letter

## 🆘 Need More Help?

- **Detailed formatting instructions:** See `FORMATTING_GUIDE.md`
- **AI-powered conversion:** See `PDF_GENERATION_PROMPT.md`
- **Manual Word conversion:** See `FORMATTING_GUIDE.md` Section "Option 2"

## 💡 Pro Tips

1. **Best Quality:** Use Pandoc (Method 1) or Claude AI (Method 4)
2. **Fastest:** Online tools (Method 6)
3. **Most Control:** Microsoft Word (Method 5)
4. **No Installation:** Online tools or AI (Methods 4 & 6)

## 📞 Support

If you encounter issues:
1. Check the error message carefully
2. Verify all dependencies are installed
3. Try an alternative method
4. Use online converters as fallback
5. Consult `FORMATTING_GUIDE.md` for manual conversion

---

**Good luck with your BCA project submission! 🎓**
