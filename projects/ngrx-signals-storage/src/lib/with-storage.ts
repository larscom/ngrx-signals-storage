import { effect } from '@angular/core'

import { getState, patchState } from '@ngrx/signals'
import { EmptyFeatureResult, SignalStoreFeature, SignalStoreFeatureResult } from '@ngrx/signals/src/signal-store-models'

export function withStorage<State extends SignalStoreFeatureResult>(
  key: string,
  storage: Storage
): SignalStoreFeature<State, EmptyFeatureResult> {
  const state = storage.getItem(key)
  const fromStorage = state ? JSON.parse(state) : null

  let patched = false
  return (store) => {
    if (Object.keys(store.slices).length === 0) {
      throw Error("'withStorage' must be after 'withState'")
    }

    if (fromStorage != null && !patched) {
      const state = Object.keys(store.slices).reduce<State>((state, key) => {
        return {
          ...state,
          [key]: fromStorage[key]
        }
      }, Object())
      patchState(store, state)
      patched = true
    }

    effect(() => {
      const state = getState(store)
      storage.setItem(key, JSON.stringify(state))
    })

    return store
  }
}
