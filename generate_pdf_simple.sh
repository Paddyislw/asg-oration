#!/bin/bash

# Simple PDF Generator for BCA Synopsis
# This script uses Pandoc to convert Markdown to professionally formatted PDF

echo "🎓 BCA Synopsis PDF Generator"
echo "================================"
echo ""

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc is not installed."
    echo ""
    echo "📦 Install Pandoc:"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install pandoc texlive-xetex texlive-fonts-recommended"
    echo ""
    echo "macOS:"
    echo "  brew install pandoc"
    echo "  brew install --cask basictex"
    echo ""
    echo "Windows:"
    echo "  Download from: https://pandoc.org/installing.html"
    echo "  Also install MiKTeX: https://miktex.org/download"
    echo ""
    exit 1
fi

echo "✅ Pandoc found: $(pandoc --version | head -n 1)"
echo ""

# Check if input file exists
if [ ! -f "BCA_PROJECT_SYNOPSIS.md" ]; then
    echo "❌ Error: BCA_PROJECT_SYNOPSIS.md not found!"
    echo "   Make sure you're in the project directory."
    exit 1
fi

echo "📄 Input file: BCA_PROJECT_SYNOPSIS.md"
echo "📤 Output file: BCA_PROJECT_SYNOPSIS.pdf"
echo ""
echo "🔄 Generating PDF..."
echo ""

# Generate PDF with professional formatting
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
  -V toccolor=black \
  --highlight-style=tango \
  --metadata title="BCA Project Synopsis - ASG-Oration: AI-Powered Career Counseling Platform" \
  --metadata author="BCA Student - Uttaranchal University" \
  --metadata date="$(date +'%B %Y')" \
  --metadata subject="Bachelor of Computer Applications Project Synopsis" \
  --metadata keywords="BCA, Project, Synopsis, AI, Career Counseling, Next.js, TypeScript" \
  2>&1

# Check if successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! PDF generated successfully!"
    echo ""
    echo "📍 Location: $(pwd)/BCA_PROJECT_SYNOPSIS.pdf"
    echo "📊 File size: $(du -h BCA_PROJECT_SYNOPSIS.pdf | cut -f1)"
    echo ""
    echo "📖 Next steps:"
    echo "   1. Open BCA_PROJECT_SYNOPSIS.pdf to review"
    echo "   2. Update placeholders: [Student Name], [Learner ID], [Guide Name]"
    echo "   3. Fine-tune in Microsoft Word if needed"
    echo "   4. Print on A4 paper for submission"
    echo ""
else
    echo ""
    echo "❌ Error generating PDF!"
    echo ""
    echo "💡 Common fixes:"
    echo "   1. Install missing LaTeX packages:"
    echo "      sudo apt-get install texlive-latex-extra"
    echo "   2. Try with a different PDF engine:"
    echo "      pandoc BCA_PROJECT_SYNOPSIS.md -o output.pdf --pdf-engine=pdflatex"
    echo "   3. Check the error message above for specific issues"
    echo ""
    exit 1
fi
