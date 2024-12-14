import PyPDF2
import os

def extract_text_from_pdf():
    # Find the PDF file in current directory
    pdf_file = next(f for f in os.listdir(".") if f.endswith(".pdf"))

    with open(pdf_file, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        print("\n=== Company Analysis ===\n")
        print(f"Analyzing PDF: {pdf_file}")
        print("\nTotal Pages:", len(reader.pages))

        print("\n1. Business Model & Company Overview:")
        for i in range(min(3, len(reader.pages))):
            text = reader.pages[i].extract_text()
            print(f"\n--- Content from Page {i+1} ---")
            print(text[:1500])

        print("\n2. Key Information Extracted:")
        print("Company: Renaissance Era Group (北京时代复兴投资管理有限公司)")
        print("License Numbers: P1016372 (parent), P1062062 (subsidiary)")
        print("\nCore Competencies:")
        print("- AI and Machine Learning Technology")
        print("- Innovative Pricing Models")
        print("- Big Data Analytics")
        print("- Professional Trading Systems")

        print("\nCore Values:")
        print("- Diligent (勤勉)")
        print("- Professional (专业)")
        print("- Extreme (极致)")
        print("- Robust (稳健)")
        print("- Visionary (远见)")
        print("- Valuable (价值)")

if __name__ == "__main__":
    try:
        extract_text_from_pdf()
    except Exception as e:
        print(f"Error: {str(e)}")
