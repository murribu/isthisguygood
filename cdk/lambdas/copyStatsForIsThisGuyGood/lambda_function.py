import json
import os
import boto3

def lambda_handler(event, context):
  s3 = boto3.client('s3')
  obj = s3.get_object(
    Bucket=os.environ['source_bucket'], # pagedumps
    Key=os.environ['source_key'] # mlb/teams/pitchers.json
  )

  stats = obj['Body'].read()
  s3.put_object(Body=stats, Bucket=os.environ['destination_bucket'], Key='static/data/pitchers.json')