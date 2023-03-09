import * as Realm from 'realm'
import { type Collection, type CollectionChangeSet } from 'realm'

// NB: polymorphism/inheritance is not yet supported in Realm, so we use generics here instead
export function getObjListener<T> (tableName: string, getString: (obj: T) => string)
  : ((objs: Collection<T>, changes: CollectionChangeSet) => void) {
  return (objs: Collection<T>, changes: CollectionChangeSet) => {
    changes.deletions.forEach((index) => {
      console.log(`A ${tableName.toLowerCase()} was deleted`)
    })
    changes.insertions.forEach((index) => {
      const insertedObj = objs[index]
      console.log(`Inserted ${tableName.toLowerCase()} ${getString(insertedObj)}`)
    })
    changes.newModifications.forEach((index) => {
      const modifiedObj = objs[index]
      console.log(`Modified ${tableName.toLowerCase()} ${getString(modifiedObj)}`)
    })
  }
}

export function getObjectsJSON<T> (realm: Realm, tableName: string, filter: string): T[] {
  const objs = realm.objects<T>(tableName).filtered(filter)
  console.log(`Found ${objs.length} ${tableName.toLowerCase()}(s)`)

  const res = []
  for (const obj of objs) {
    res.push(obj as T)
  }

  return res
}

export function createSomeObjs<T> (realm: Realm, tableName: string, numObjs: number, genObj: () => Unmanaged<T>, isAsymmetric: boolean = false) {
  for (let i = 0; i < numObjs; i++) {
    console.log(`Creating a ${tableName.toLowerCase()}...`)
    realm.write(() => {
      realm.create(tableName, genObj())
    })
    if (!isAsymmetric) { // Can't read asymmetric objects in the realm
      console.log(`Created. Now have ${realm.objects<T>(tableName).length} ${tableName.toLowerCase()}(s)`)
    }
  }
}

export function deleteAllObjs<T> (realm: Realm, tableName: string) {
  const objs = realm.objects<T>(tableName)
  console.log(`Deleting ${objs.length} ${tableName.toLowerCase()}(s)...`)

  for (const obj of objs) {
    console.log(`Deleting a ${tableName.toLowerCase()}...`)
    realm.write(() => {
      realm.delete(obj)
    })
    console.log('Deleted')
  }
}
