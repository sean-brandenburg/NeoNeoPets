# NeoNeoPets
neoneopets

## Frontend Instructions

1. `npm i`

2. `npm run dev`


## Node Server

Add the following to node/config.json
```
{
    "AppId": "<MongoAppID>",
    "nyc": "<Tiered_Sync_Server_IP>",
    "atx": "<Tiered_Sync_Server_IP>",
    "cloud": "https://realm.mongodb.com"
}
```

- `cd node` then run the relevant command for the server you want to connect to
  - `npm run nyc`
  - `npm run atx`
  - `npm run cloud`
