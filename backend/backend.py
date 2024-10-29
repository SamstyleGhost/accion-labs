import pandas
import requests
from dotenv import load_dotenv
from io import BytesIO
from PyPDF2 import PdfReader
import os
from supabase import create_client, Client
import tiktoken
from sentence_transformers import SentenceTransformer
import json
import numpy
import summarizer
import date_converter

load_dotenv()
csvFile = pandas.read_csv("./../data/shortlisted_cases.csv")
url: str = os.environ["SUPABASE_URL"]
key: str = os.environ["SUPABASE_ACCESS_TOKEN"]

supabase: Client = create_client(url, key)
encoding_name = "cl100k_base"
encoding = tiktoken.get_encoding(encoding_name)
baseURL = "https://api.sci.gov.in/"
CHUNK_SIZE = 300
model = SentenceTransformer('thenlper/gte-large')

def readCSV():
  
  # If the value is empty in the CSV file, it will print NULL in the database
  def get_value(value):
    return value if pandas.notna(value) and value != "" else "NULL"

  for index, row in csvFile.iterrows():
    chunks = []

    # NOTE: I have a function in supabase that inserts both the metadata as well as chunks, but I am going to be inserting the metadata only once and the chunks separately
    # NOTE: So I will just insert the metadata here and the chunks later down the code

    curr = {}     
    curr["case_no"] = get_value(row["case_no"])
    curr["diary_no"] = get_value(row["diary_no"])
    curr["judgement_type"] = get_value(row["Judgement_type"])
    curr["petitioner"] = get_value(row["pet"])
    curr["respondent"] = get_value(row["res"])
    curr["petitioner_advocate"] = get_value(row["pet_adv"])
    curr["respondent_advocate"] = get_value(row["res_adv"])
    curr["bench"] = get_value(row["bench"])
    curr["judge"] = get_value(row["judgement_by"])
    curr["judgement_date"] = date_converter.convert_to_mm_dd_yyyy(get_value(row["judgment_dates"]))
    curr["document_link"] = get_value(row["temp_link"])

    # Get the textual data from the pdf through the Supreme Court API
    # Also cleaning some artifacts from it
    docContents = getPDF(baseURL + row['temp_link'])
    orderIndex = docContents.find("O R D E R")
    judgementIndex = docContents.find("J U D G M E N T")
    minimum = min(orderIndex, judgementIndex)
    if orderIndex == -1:
      minimum = judgementIndex
    if judgementIndex == -1:
      minimum = orderIndex

    # Making sure there is no whitespace around the words
    docContentsStripped = docContents[minimum:].strip()

    # getting the summary for the cleaned doc
    summary = summarizer.getSummary(docContentsStripped)
    curr["summary"] = summary

    response = supabase.table("judgements_sc").insert(curr).execute()
    print(response)

    splitContents = summary.split('. ')
    sentence = ""

    # Creating chunks of about ~300 token size
    for chunk in splitContents:
      chunk = chunk.strip()
      if len(encoding.encode(sentence)) > CHUNK_SIZE:
        chunks.append(sentence)
        sentence = ""
      sentence += chunk
      
    if sentence != "":
      chunks.append(sentence.strip())
      sentence = ""

    # Creating vector embeddings of chunks and pushing them to the database
    for chunk in chunks:
      embeddings = model.encode(chunk)
      embedToSend = embeddings.tolist()
      newCurr = {}
      newCurr["case_no"] = curr["case_no"]
      newCurr["embedding"] = embedToSend
      response = supabase.table("judgements_embeddings").insert(newCurr).execute()
      print(response)

def getPDF(url):
  response = requests.get(url)
  filecontents = ""
  if response.status_code == 200:
    pdf_file = BytesIO(response.content)
    reader = PdfReader(pdf_file)
    for page in reader.pages:
      filecontents += page.extract_text()
  else:
    print(f"Failed to fetch the PDF. Status code: {response.status_code}")
      
  return filecontents
    
readCSV()
