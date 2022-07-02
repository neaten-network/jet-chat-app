import { ref, watchEffect } from "vue"
import { projectFirestore } from '../firebase/config'

const getUsers = (collection, user) => {
  const users = ref(null)

  let collectionRef = projectFirestore.collection(collection)

  const unsub = collectionRef.onSnapshot((snap) => {
    let results = []
    // console.log('snapshot')
    snap.docs.forEach(doc => {
      results.push( { ...doc.data(), id: doc.id })
    })

    // filter users
    users.value = results.filter(doc => {
      return doc.displayName !== user.value.displayName
    })
  }, (err) => {
    console.log(err.message)
    users.value = null
  })

  // Unsubscribing from the real time listener(snapshot) when watcher is stopped(component unmounted)
  watchEffect((onInvalidate) => {
    onInvalidate(() => {
      unsub()
    })
  })

  return { users }
}

export default getUsers
