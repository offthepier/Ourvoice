import json
import os
from time import sleep
from tqdm import tqdm

def get_tablenames():
    os.system('aws dynamodb list-tables > tablenames.json')

get_tablenames()

tablenames = json.load(open('tablenames.json'))

os.mkdir('data_marshalled')
os.mkdir('data_source')

names = tablenames['TableNames']

print("Retrieving Tables")
for name in tqdm(names):
    os.system(f'aws dynamodb scan --table-name {name} > data_marshalled/{name}.json')
    sleep(0.5)

print("Formatting Marshalled Data")
for name in tqdm(names):
    mar = json.load(open(f'data_marshalled/{name}.json'))
    items = mar['Items']
    json.dump(items, open(f'data_source/{name}.json', 'w'))