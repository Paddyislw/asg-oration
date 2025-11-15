#!/usr/bin/env python3
"""
BCA Synopsis PDF Generator
Converts Markdown to beautifully formatted PDF following BCA guidelines
"""

import sys
import subprocess
from pathlib import Path
from datetime import datetime

def check_dependencies():
    """Check if required tools are installed"""
    print("🔍 Checking dependencies...\n")

    # Check for markdown2pdf alternatives
    tools = {
        'pandoc': 'pandoc --version',
        'weasyprint': 'python3 -c "import weasyprint"',
        'markdown': 'python3 -c "import markdown"'
    }

    available = {}
    for tool, cmd in tools.items():
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, timeout=5)
            available[tool] = result.returncode == 0
        except:
            available[tool] = False

    return available

def install_instructions():
    """Print installation instructions"""
    print("\n📦 Installation Required\n")
    print("Choose one of the following methods:\n")

    print("Method 1: Using Pandoc (Recommended)")
    print("-" * 50)
    print("Ubuntu/Debian:")
    print("  sudo apt-get install pandoc texlive-xetex")
    print("\nmacOS:")
    print("  brew install pandoc basictex")
    print("\nWindows:")
    print("  Download from: https://pandoc.org/installing.html")
    print()

    print("Method 2: Using Python Libraries")
    print("-" * 50)
    print("pip3 install markdown weasyprint")
    print()

    print("Method 3: Online Converter")
    print("-" * 50)
    print("Visit: https://cloudconvert.com/md-to-pdf")
    print("Upload: BCA_PROJECT_SYNOPSIS.md")
    print()

def generate_with_pandoc():
    """Generate PDF using Pandoc"""
    print("📄 Generating PDF with Pandoc...\n")

    cmd = [
        'pandoc', 'BCA_PROJECT_SYNOPSIS.md',
        '-o', 'BCA_PROJECT_SYNOPSIS.pdf',
        '--pdf-engine=xelatex',
        '--toc',
        '--toc-depth=3',
        '--number-sections',
        '-V', 'documentclass=report',
        '-V', 'papersize=a4',
        '-V', 'geometry:top=2.54cm, bottom=2.54cm, left=3.81cm, right=2.54cm',
        '-V', 'fontsize=12pt',
        '-V', 'mainfont=Times New Roman',
        '-V', 'linestretch=1.5',
        '-V', 'colorlinks=true',
        '-V', 'linkcolor=blue',
        '--highlight-style=tango',
        '--metadata', 'title=BCA Project Synopsis - ASG-Oration',
        '--metadata', f'date={datetime.now().strftime("%B %Y")}'
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)

        if result.returncode == 0:
            return True, "Success"
        else:
            return False, result.stderr
    except Exception as e:
        return False, str(e)

def generate_with_weasyprint():
    """Generate PDF using WeasyPrint (Python library)"""
    print("📄 Generating PDF with WeasyPrint...\n")

    try:
        import markdown
        from weasyprint import HTML, CSS

        # Read markdown file
        with open('BCA_PROJECT_SYNOPSIS.md', 'r', encoding='utf-8') as f:
            md_content = f.read()

        # Convert to HTML
        html_content = markdown.markdown(
            md_content,
            extensions=['tables', 'fenced_code', 'toc']
        )

        # Professional CSS
        css_content = """
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
        }

        th {
            background-color: #1e40af;
            color: white;
            padding: 8px;
            text-align: left;
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
            background-color: #f1f5f9;
            padding: 2px 4px;
            border-radius: 3px;
        }

        pre {
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 12px;
            overflow-x: auto;
            font-size: 10pt;
        }
        """

        # Create full HTML
        html_full = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>BCA Project Synopsis - ASG-Oration</title>
        </head>
        <body>
            {html_content}
        </body>
        </html>
        """

        # Generate PDF
        HTML(string=html_full).write_pdf(
            'BCA_PROJECT_SYNOPSIS.pdf',
            stylesheets=[CSS(string=css_content)]
        )

        return True, "Success"

    except Exception as e:
        return False, str(e)

def main():
    """Main execution function"""
    print("=" * 60)
    print("🎓 BCA PROJECT SYNOPSIS - PDF GENERATOR")
    print("=" * 60)
    print()

    # Check if input file exists
    if not Path('BCA_PROJECT_SYNOPSIS.md').exists():
        print("❌ Error: BCA_PROJECT_SYNOPSIS.md not found!")
        print("   Make sure you're in the correct directory.")
        sys.exit(1)

    # Check dependencies
    deps = check_dependencies()

    success = False
    error_msg = ""

    # Try Pandoc first (best quality)
    if deps['pandoc']:
        print("✅ Using Pandoc (Recommended)\n")
        success, error_msg = generate_with_pandoc()

    # Fallback to WeasyPrint
    elif deps['weasyprint'] and deps['markdown']:
        print("✅ Using WeasyPrint (Python Library)\n")
        success, error_msg = generate_with_weasyprint()

    # No tools available
    else:
        print("❌ No PDF generation tools found!\n")
        install_instructions()
        sys.exit(1)

    # Check result
    if success:
        print("\n" + "=" * 60)
        print("✅ SUCCESS! PDF Generated Successfully!")
        print("=" * 60)
        print()
        print(f"📍 Location: {Path('BCA_PROJECT_SYNOPSIS.pdf').absolute()}")

        # Get file size
        file_size = Path('BCA_PROJECT_SYNOPSIS.pdf').stat().st_size
        file_size_mb = file_size / (1024 * 1024)
        print(f"📊 File Size: {file_size_mb:.2f} MB")
        print()
        print("📖 Next Steps:")
        print("   1. Open BCA_PROJECT_SYNOPSIS.pdf to review")
        print("   2. Replace placeholders:")
        print("      - [Student Name]")
        print("      - [Your Learner ID]")
        print("      - [Guide Name with Designation]")
        print("      - [Current Date]")
        print("   3. Optional: Fine-tune in Microsoft Word")
        print("   4. Print on A4 paper for submission")
        print()
        print("💡 Tip: See FORMATTING_GUIDE.md for detailed instructions")
        print()
    else:
        print("\n❌ Error generating PDF:")
        print(f"   {error_msg}")
        print()
        install_instructions()
        sys.exit(1)

if __name__ == "__main__":
    main()
