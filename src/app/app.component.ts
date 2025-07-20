import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { withStorage } from '@larscom/ngrx-signals-storage'

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'

export const CounterStore = signalStore(
  withState({
    count: 100,
    test: 5,
    date: new Date(),
    unique: new Set([1, 1, 3, 3])
  }),
  withStorage('state', () => sessionStorage, {
    excludeKeys: ['test'],
    serialize: (state) => JSON.stringify({ ...state, unique: Array.from(state.unique) }),
    deserialize: (stateString) => {
      const state = JSON.parse(stateString)
      return {
        ...state,
        unique: new Set(state.unique)
      }
    }
  }),
  withMethods(({ count, ...store }) => ({
    setDate(date: Date) {
      patchState(store, { date })
    },
    increment(by: number) {
      patchState(store, { count: count() + by })
    }
  }))
)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  providers: [CounterStore],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  store = inject(CounterStore)

  constructor() {
    setTimeout(() => this.store.increment(100), 3000)
  }

  get uniqueNumbers() {
    return Array.from(this.store.unique())
  }
}
