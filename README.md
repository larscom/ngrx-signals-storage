# @larscom/ngrx-signals-storage

[![npm-version](https://img.shields.io/npm/v/@larscom/ngrx-signals-storage.svg?label=npm)](https://www.npmjs.com/package/@larscom/ngrx-signals-storage)
![npm](https://img.shields.io/npm/dw/@larscom/ngrx-signals-storage)
[![license](https://img.shields.io/npm/l/@larscom/ngrx-signals-storage.svg)](https://github.com/larscom/ngrx-signals-storage/blob/master/LICENSE)

> Save signal state (@ngrx/signals) to localStorage/sessionStorage and restore the state on page load.

## Installation

```bash
npm install @larscom/ngrx-signals-storage
```

## Dependencies

`@larscom/ngrx-signals-storage` depends on [@ngrx/signals](https://ngrx.io/guide/signals/install) and [Angular](https://github.com/angular/angular)

```bash
   npm install @ngrx/signals
```

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
  withStorage('myKey', sessionStorage)
)
```
