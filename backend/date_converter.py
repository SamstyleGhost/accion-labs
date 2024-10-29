import pandas

def convert_to_mm_dd_yyyy(date_str):
  for fmt in ("%d-%m-%Y", "%d/%m/%Y", "%Y-%m-%d", "%m/%d/%Y"):
    try:
      return pandas.to_datetime(date_str, format=fmt).strftime('%m-%d-%Y')
    except ValueError:
      continue
  return None  # Return None if all formats fail
