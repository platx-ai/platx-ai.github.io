import PyPDF2
import sys

def extract_text_from_pdf(filename):
    with open(filename, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        return text

try:
    filename = '[时代复兴] - 详版 - AI全资产配置基金_241115 DZX.pdf'
    text = extract_text_from_pdf(filename)
    print(text[:2000])  # Print first 2000 characters for initial analysis
except Exception as e:
    print(f'Error: {str(e)}')
