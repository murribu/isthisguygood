import json
import os
import boto3
import sys

CWD = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, os.path.join(CWD, "lib"))

import requests

def lambda_handler(event, context):
  s3 = boto3.client('s3')
  r =requests.get('https://bdfed.stitch.mlbinfra.com/bdfed/stats/player?stitch_env=prod&season=2020&sportId=1&stats=season&group=pitching&gameType=R&limit=9999&offset=0&sortStat=earnedRunAverage&order=asc&playerPool=ALL')

  stats = r.text
  s3.put_object(Body=stats, Bucket=os.environ['destination_bucket'], Key='static/data/pitchers.2020.json')