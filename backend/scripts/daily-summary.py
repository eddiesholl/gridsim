import json
from datetime import datetime

with open('../data/opennem-energy-fueltech_group-5m-20250301-20250308.json', 'r') as f:
    original_json = json.load(f)

# print(data)  # Let's see the structure of the first item

data = original_json['data']
meta = data[0]
results = meta.get('results')

date_start = meta['date_start']
date_end = meta['date_end']
interval = meta['interval']

print(meta['date_start'])
print(meta['date_end'])

# create x axis
x = [5 * t for t in range(0, 24*12)]

entries = []
i = 0
for fueltech in results:
    print(fueltech['columns']['fueltech_group'])
    intervals = {}
    for sample in fueltech['data']:
        t = sample[0]
        y = sample[1]
        dt = datetime.fromisoformat(t)
        # get the total minutes of the day ie 0-1440
        i = dt.hour * 60 + dt.minute
        if i not in intervals:
            intervals[i] = [y]
        else:
            intervals[i].append(y)

    y = []
    for xval in x:
        points = intervals.get(xval, [])
        if len(points) > 0:
            y.append(sum(points) / len(points))
        else:
            y.append(0)

    entry = {
        'name': fueltech['columns']['fueltech_group'],
        'y': y
    }
    i=i+1
    entries.append(entry)
    # capture every y data point in an array

output = {
    'type': 'daily-summary',
    'source': '../data/opennem-energy-fueltech_group-5m-20250301-20250308.json',
    'date_start': date_start,
    'date_end': date_end,
    'interval': interval,
    'x': x,
    'entries': entries
}

with open('../data/daily-summary.json', 'w') as f:
    json.dump(output, f, indent=4)