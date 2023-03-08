import Realm from 'realm'

import express from 'express'
import type { Request, Response } from 'express'

import { type UserInfo, UserInfoSchema, getUserInfoString } from './models/UserInfo'
import { type PetStat, PetStatsSchema, getStatsString } from './models/PetStats'

// import fetch from 'node-fetch'
const config = require('../config.json');

// import { handler } from '../../build/handler.js';
// const handler = require('../../build/handler.js');
// import handler from '../../build/handler.js'

import { getObjListener, getObjectsJSON } from './utils/realmHelpers'
import cors from 'cors'
export const exp = express()
exp.use(cors())
exp.use(express.static('../build/'))


const hostname = '127.0.0.1'
const port = 3000

const app = new Realm.App({
  id: config.AppId,
  baseUrl: config[process.argv[2]] // Cloud/nyc/atx baseUrl
})

let realm: Realm = null

async function setup (app: Realm.App<Realm.DefaultFunctionsFactory, any>): Promise<Realm> {
  const credentials = Realm.Credentials.anonymous()
  await app.logIn(credentials)

  const cfg: Realm.FlexibleSyncConfiguration = {
    user: app.currentUser,
    flexible: true
  }

  const config = {
    schema: [UserInfoSchema, PetStatsSchema],
    sync: cfg
  }

  return await Realm.open(config)
}

// TODO: Filter to just relevant non-boolean stats
// A 50% chance to atrophy or something would be cool here
function atrophyPetStats (): void {
  if (realm != null) {
    realm.write(() => {
      const statsObjects = realm.objects<PetStat>(PetStatsSchema.name).filtered('statName != "online"')
      for (const stat of statsObjects) {
        if (stat.statValue < 0) {
          stat.statValue = 0
          console.warn(`Stat "${stat.statName}" is less than 0!`)
        } else if (stat.statValue > 0) {
          stat.statValue--
        }
      }
    })
  }
}

async function getOfflineStatus (): Promise<void> {
  try {
    // const response = await fetch('http://10.96.10.247/api/client/v2.0/tiered-sync/status', {})
    // const onlineStatus = await response.json().cloud_connected
    // const statsObjects = realm.objects<PetStat>(PetStatsSchema.name).filtered('statName == "online"')
    // for (const stat of statsObjects) {
    //   stat.statValue = 
    // }
  } catch (error) {
    console.warn('could not get online status')
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function main () {
  const credentials = Realm.Credentials.anonymous()
  await app.logIn(credentials)
  realm = await setup(app)
  const subs = realm.subscriptions

  console.log("1")
  await subs.update(mutableSubs => {
    // Clear out any subscriptions that may have been added in a previous execution
    const nRemoved = mutableSubs.removeAll()
    console.log(`Cleared out previous subscriptions (${nRemoved} removed)`)

    // TODO: Subscription pet names from startup params
    mutableSubs.add(realm.objects(PetStatsSchema.name).filtered('truepredicate'))
    mutableSubs.add(realm.objects(UserInfoSchema.name).filtered('truepredicate'))
  })
  await subs.waitForSynchronization()
  console.log("2")

  const petStats = realm.objects<PetStat>(PetStatsSchema.name)
  petStats.addListener(getObjListener<PetStat>(PetStatsSchema.name, getStatsString))
  const userInfo = realm.objects<UserInfo>(UserInfoSchema.name)
  userInfo.addListener(getObjListener<UserInfo>(UserInfoSchema.name, getUserInfoString))
  console.log("3")
}

main()
  .then(() => {
    console.log('SETUP SUCCEEDED')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

// --- ROUTES --- //

exp.get('/petStats/', (req: Request, res: Response) => {
  // TODO:
  if (realm == null) {
    res.statusCode = 400
    res.end()
    return
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')

  const query = 'truepredicate'
  console.log(`Getting pet stats with query: ${query}`)
  res.send(getObjectsJSON<PetStat>(realm, PetStatsSchema.name, query))

  res.end()
})

exp.get('/getNewUserActions/:lastQueriedTime', (req: Request, res: Response) => {
  // TODO:
  if (realm == null) {
    res.statusCode = 400
    res.end()
    return
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')

  const query = `lastAction > ${req.params.lastQueriedTime as string}`
  console.log(`Getting user actions with query: ${query}`)
  res.send(getObjectsJSON<UserInfo>(realm, UserInfoSchema.name, query))
  res.end()
})

exp.listen(port, hostname, () => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(getOfflineStatus, 3000)
  setInterval(atrophyPetStats, 3000)

  console.log(`Server running at http://${hostname}:${port}/`)
})
