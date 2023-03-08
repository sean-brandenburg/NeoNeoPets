import { userInfo } from 'os'
import type Realm from 'realm'

export interface UserInfo {
  _id: Realm.BSON.ObjectId
  lastAction: Date
  actionTaken: string
  petName: string
  location: string
}

export const UserInfoSchema = {
  name: 'UserInfo',
  properties: {
    _id: 'string',
    lastAction: 'date',
    actionTaken: 'string',
    petName: 'string',
    location: 'string'
  },
  primaryKey: '_id'
}

export function getUserInfoString (userInfo: UserInfo): string {
  return JSON.stringify(userInfo)
}

export function printUserString (userInfo: UserInfo): void {
  console.log(`User Info: ${getUserInfoString(userInfo)}`)
}
