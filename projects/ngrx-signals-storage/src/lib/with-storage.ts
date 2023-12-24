import { effect } from '@angular/core'

import { getState, patchState } from '@ngrx/signals'
import { EmptyFeatureResult, SignalStoreFeature, SignalStoreFeatureResult } from '@ngrx/signals/src/signal-store-models'

/**
 * The `withStorage` function that lets you save the state to localstorage/sessionstorage
 * and rehydrate the state upon page load.
 *
 * @param key the key under which the state should be saved into `Storage`
 * @param storage the implementation
 *
 * @example
 *  export const CounterStore = signalStore(
 *     withState({
 *       count: 0
 *     }),
 *     withStorage('myKey', sessionStorage)
 *   )
 *
 * Check out github for more information.
 * @see https://github.com/larscom/ngrx-signals-storage
 */
export function withStorage<State extends SignalStoreFeatureResult>(
  key: string,
  storage: Storage
): SignalStoreFeature<State, EmptyFeatureResult> {
  const item = storage.getItem(key)
  const storageState: State['state'] | null = item ? JSON.parse(item) : null

  let hydrated = false

  return (store) => {
    if (Object.keys(store.slices).length === 0) {
      throw Error("'withStorage' must be after 'withState'")
    }

    if (storageState != null && !hydrated) {
      const state = Object.keys(store.slices).reduce((state, key) => {
        const value = storageState[key as keyof State['state']]
        return value
          ? {
              ...state,
              [key]: value
            }
          : state
      }, getState(store))

      patchState(store, state)
      hydrated = true
    }

    effect(() => {
      const state = getState(store)
      storage.setItem(key, JSON.stringify(state))
    })

    return store
  }
}
