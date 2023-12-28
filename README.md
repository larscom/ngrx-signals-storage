# @larscom/ngrx-signals-storage

[![npm-version](https://img.shields.io/npm/v/@larscom/ngrx-signals-storage.svg?label=npm)](https://www.npmjs.com/package/@larscom/ngrx-signals-storage)
![npm](https://img.shields.io/npm/dw/@larscom/ngrx-signals-storage)
[![license](https://img.shields.io/npm/l/@larscom/ngrx-signals-storage.svg)](https://github.com/larscom/ngrx-signals-storage/blob/master/LICENSE)
[![codecov](https://codecov.io/gh/larscom/ngrx-signals-storage/graph/badge.svg?token=AhO0viaKOA)](https://codecov.io/gh/larscom/ngrx-signals-storage)

> Save signal state (@ngrx/signals) to localStorage/sessionStorage and restore the state on page load.

## Installation

```bash
npm install @larscom/ngrx-signals-storage
```

## Dependencies

`@larscom/ngrx-signals-storage` depends on [@ngrx/signals](https://ngrx.io/guide/signals/install) and [Angular](https://github.com/angular/angular)

## Usage

Import `withStorage` function

```ts
import { withStorage } from '@larscom/ngrx-signals-storage'
import { withState, signalStore } from '@ngrx/signals'

export const CounterStore = signalStore(
  withState({
    count: 0
  }),
  // state will be saved to sessionStorage under the key: 'myKey'
  // extra config can be passed as 3th argument
  withStorage('myKey', sessionStorage, { shouldSave: ({ count }) => count > 0 })
)
```

## Configuration

```ts
export interface Config<T> {
  /**
   * Function that gets executed on a storage error (get/set)
   * @param error the error that occurred
   */
  error: (error: any) => void

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
  shouldSave: (state: T) => boolean
}
```
