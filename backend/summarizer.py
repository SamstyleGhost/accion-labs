from __future__ import absolute_import
from __future__ import division, print_function, unicode_literals

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

LANGUAGE = "english"
SENTENCES_COUNT = 20

def getSummary(content):
  summary = ""
  parser = PlaintextParser.from_string(content, Tokenizer(LANGUAGE))
  stemmer = Stemmer(LANGUAGE)

  summarizer = Summarizer(stemmer)
  summarizer.stop_words = get_stop_words(LANGUAGE)
  for sentence in summarizer(parser.document, SENTENCES_COUNT):
    summary += sentence._text
    
  return summary
