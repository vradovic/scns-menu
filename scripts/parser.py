#!/usr/bin/env python3
import requests
import sys
import fitz
import re
from datetime import datetime
from pymongo import MongoClient
from srtools import cyrillic_to_latin

if __name__ == '__main__':
  PDF_URL = sys.argv[1]
  MONGO_URL = sys.argv[2]

  # Download PDF
  # response = requests.get(PDF_URL)
  # with open('jelovnik.pdf', 'wb') as f:
  #   f.write(response.content)


  # Parse PDF
  doc = fitz.open('jelovnik.pdf')
  pages = doc.pages()
  menus = []
  for page in pages:
    for tab in page.find_tables(strategy="lines_strict"):
      data = tab.extract()

      if len(data) >= 2:
        if match := re.search(r'^\w+ (\d{1,2}\.\d{1,2}\.\d{4}\.$)', data[0][0]):
          date = datetime.strptime(match.group(1), '%d.%m.%Y.')
        else:
          continue
        
        breakfast = data[1][0]
        lunch = data[1][1]
        dinner = data[1][2] if len(data) == 2 else data[1][2] + '\n' + data[2][2]

        menus.append({
          'date': date,
          'breakfast': cyrillic_to_latin(breakfast),
          'lunch': cyrillic_to_latin(lunch),
          'dinner': cyrillic_to_latin(dinner),
        })

  # Write to MongoDB
  client = MongoClient(MONGO_URL)
  db = client['menzadb']
  collection = db['menus']
  collection.insert_many(menus)