import { effect } from '@angular/core'

import { getState, patchState } from '@ngrx/signals'
import { EmptyFeatureResult, SignalStoreFeature, SignalStoreFeatureResult } from '@ngrx/signals/src/signal-store-models'
import { Config, defaultConfig } from './config'

/**
 * The `withStorage` function that lets you save the state to localstorage/sessionstorage
 * and rehydrate the state upon page load.
 *
 * @param key the key under which the state should be saved into `Storage`
 * @param storage an implementation of the `Storage` interface, like: `sessionStorage` or `localStorage`
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
  storage: Storage,
  config?: Partial<Config<State['state']>>
): SignalStoreFeature<State, EmptyFeatureResult> {
  const cfg = { ...defaultConfig, ...config }

  const item = getFromStorage(key, storage, cfg)
  const storageState: State['state'] | null = item ? cfg.deserialize(item) : null

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
      try {
        if (cfg.shouldSave(state)) {
          storage.setItem(key, cfg.serialize(state))
        }
      } catch (e) {
        cfg.error(e)
      }
    })

    return store
  }
}

function getFromStorage<T>(key: string, storage: Storage, cfg: Config<T>): string | null {
  try {
    return storage.getItem(key)
  } catch (e) {
    cfg.error(e)
    return null
  }
}
