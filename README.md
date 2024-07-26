# @larscom/ngrx-signals-storage

[![npm-version](https://img.shields.io/npm/v/@larscom/ngrx-signals-storage.svg?label=npm)](https://www.npmjs.com/package/@larscom/ngrx-signals-storage)
![npm](https://img.shields.io/npm/dw/@larscom/ngrx-signals-storage)
[![license](https://img.shields.io/npm/l/@larscom/ngrx-signals-storage.svg)](https://github.com/larscom/ngrx-signals-storage/blob/main/LICENSE)

> Save signal state (@ngrx/signals) to localStorage/sessionStorage and restore the state on page load.

## Installation

```bash
npm install @larscom/ngrx-signals-storage
```

## Dependencies

`@larscom/ngrx-signals-storage` depends on [@ngrx/signals](https://ngrx.io/guide/signals/install) and [Angular](https://github.com/angular/angular)

## Usage

Import `withStorage` function and place it after the `withState` function.

```ts
import { withStorage } from '@larscom/ngrx-signals-storage'
import { withState, signalStore } from '@ngrx/signals'

export const CounterStore = signalStore(
  withState({
    count: 0
  }),
  // state will be saved to sessionStorage under the key: 'myKey'
  // optional config can be passed as 3th argument
  withStorage('myKey', sessionStorage, { saveIf: ({ count }) => count > 0 })
)
```

## Configuration

```ts
export interface Config<T> {
  /**
   * These keys will not get saved to storage
   */
  excludeKeys: Array<keyof T>

  /**
   * Serializer for the state, by default it uses `JSON.stringify()`
   * @param state the last state known before it gets saved to storage
   */
  serialize: (state: T) => string

  /**
   * Deserializer for the state, by default it uses `JSON.parse()`
   * @param state the last state known from the storage location
   */
  deserialize: (state: string) => T

  /**
   * Save to storage will only occur when this function returns true
   * @param state the last state known before it gets saved to storage
   */
  saveIf: (state: T) => boolean

  /**
   * Function that gets executed on a storage error (get/set)
   * @param error the error that occurred
   */
  error: (error: any) => void
}
```

## Common Issues

Whenever you get errors this is most likely due to serialization / deserialization of the state.

Objects like `Map` and `Set` are not serializable so you might need to implement your own serialize / deserialize function.

### Example (Set)

Lets say you have a `Set` in your store, then you need a custom serialize / deserialize function to convert from `Set` to `Array` (serialize) and from `Array` to `Set` (deserialize)

```ts
export const MyStore = signalStore(
  withState({
    mySet: new Set([1, 1, 3, 3])
  }),
  withStorage('myKey', sessionStorage, {
    serialize: (state) => JSON.stringify({ ...state, mySet: Array.from(state.mySet) }),
    deserialize: (stateString) => {
      const state = JSON.parse(stateString)
      return {
        ...state,
        mySet: new Set(state.mySet)
      }
    }
  })
)
```
