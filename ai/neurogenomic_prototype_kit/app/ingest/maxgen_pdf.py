# Extend this with robust PDF parsers for MaxGen-style reports (or accept VCF/23andMe raw data).
# For now, we parse nothing and return placeholders. Use OCR if necessary.

def parse_maxgen_pdf_to_genotypes(pdf_path: str) -> dict:
    # TODO: implement real parsing logic
    return {}