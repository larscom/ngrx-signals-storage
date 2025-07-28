import { isPlatformServer } from '@angular/common'
import { effect, inject, PLATFORM_ID } from '@angular/core'
import {
  EmptyFeatureResult,
  getState,
  patchState,
  SignalStoreFeature,
  signalStoreFeature,
  SignalStoreFeatureResult,
  withHooks
} from '@ngrx/signals'
import { Config, defaultConfig } from './config'

/**
 * The `withStorage` function that lets you save the state to localstorage/sessionstorage
 * and rehydrate the state upon page load.
 *
 * @param key the key under which the state should be saved into `Storage`
 * @param storage function that returns an implementation of the `Storage` interface, like: `sessionStorage` or `localStorage`
 *
 * @example
 *  export const CounterStore = signalStore(
 *     withState({
 *       count: 0
 *     }),
 *     withStorage('myKey', () => sessionStorage)
 *   )
 */
export function withStorage<T extends SignalStoreFeatureResult>(
  key: string,
  storage: () => Storage,
  config?: Partial<Config<T['state']>>
): SignalStoreFeature<T, EmptyFeatureResult> {
  return signalStoreFeature(
    withHooks({
      onInit(store, platformId = inject(PLATFORM_ID)) {
        if (isPlatformServer(platformId)) {
          return
        }

        const cfg = { ...defaultConfig, ...config }
        const item = getFromStorage(key, storage(), cfg)
        const stateFromStorage: T['state'] | null = item ? cfg.deserialize(item) : null

        if (stateFromStorage != null) {
          const stateSignalKeys = Object.keys(store)
          const state = stateSignalKeys.reduce((state, key) => {
            const value = stateFromStorage[key as keyof T['state']]
            return value
              ? {
                  ...state,
                  [key]: value
                }
              : state
          }, getState(store))

          patchState(store, state)
        }

        effect(() => {
          const state = structuredClone<object>(getState(store))
          try {
            if (cfg.saveIf(state)) {
              cfg.excludeKeys.forEach((key) => {
                delete state[key as keyof object]
              })
              storage().setItem(key, cfg.serialize(state))
            }
          } catch (e) {
            cfg.error(e)
          }
        })
      }
    })
  )
}

function getFromStorage<T extends SignalStoreFeatureResult>(
  key: string,
  storage: Storage,
  cfg: Config<T>
): string | null {
  try {
    return storage.getItem(key)
  } catch (e) {
    cfg.error(e)
    return null
  }
}
