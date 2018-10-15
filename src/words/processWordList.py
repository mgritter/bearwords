#!/usr/bin/python3

import sys
import json

out = {
    "wordList" : [],
    "suffixTree" : {}
}

for word in sys.stdin:
    out['wordList'].append( word.strip() )

json.dump( out, sys.stdout )

        
