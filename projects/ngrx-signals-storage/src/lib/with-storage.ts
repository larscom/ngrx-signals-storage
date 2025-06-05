import { effect } from '@angular/core'
import { EmptyFeatureResult, SignalStoreFeature, SignalStoreFeatureResult, getState, patchState } from '@ngrx/signals'
import { Config, defaultConfig } from './config'

/**
 * The `withStorage` function that lets you save the state to localstorage/sessionstorage
 * and rehydrate the state upon page load.
 *
 * @param key the key under which the state should be saved into `Storage`
 * @param storage an implementation of the `Storage` interface, like: `sessionStorage` or `localStorage`
 *
 * @example
 *  // for apps *without* SSR (Server Side Rendering)
 *  export const CounterStore = signalStore(
 *     withState({
 *       count: 0
 *     }),
 *     withStorage('myKey', sessionStorage)
 *   )
 *
 * @example
 *  // for apps *with* SSR (Server Side Rendering)
 *  export const CounterStore = signalStore(
 *     withState({
 *       count: 0
 *     }),
 *     withStorage('myKey', getStorage('sessionStorage'))
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
    if (storageState != null && !hydrated) {
      const stateSignals = store['stateSignals']
      const stateSignalKeys = Object.keys(stateSignals)
      const state = stateSignalKeys.reduce((state, key) => {
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
      const state = structuredClone(getState(store))
      try {
        if (cfg.saveIf(state)) {
          cfg.excludeKeys.forEach((key) => {
            delete state[key as keyof State['state']]
          })
          storage.setItem(key, cfg.serialize(state))
        }
      } catch (e) {
        cfg.error(e)
      }
    })

    return store
  }
}

function getFromStorage<State extends SignalStoreFeatureResult>(
  key: string,
  storage: Storage,
  cfg: Config<State>
): string | null {
  try {
    return storage.getItem(key)
  } catch (e) {
    cfg.error(e)
    return null
  }
}
