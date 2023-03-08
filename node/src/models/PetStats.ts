import type Realm from 'realm'

export interface PetStat {
  _id: Realm.BSON.ObjectId
  name: string
  statName: string
  statValue: number
  location: string
}

export const PetStatsSchema = {
  name: 'PetStats',
  properties: {
    _id: 'objectId',
    name: 'string',
    statName: 'string',
    statValue: 'int',
    location: 'string'
  },
  primaryKey: '_id'
}

export function getStatsString (petStats: PetStat): string {
  return `name: ${petStats.name}, statName: ${petStats.statName}, statValue: ${petStats.statValue} `
}

export function printStats (petStats: PetStat): void {
  console.log(`Stat: ${getStatsString(petStats)}`)
}
