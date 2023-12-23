import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { withStorage } from '@larscom/ngrx-signals-storage'

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'

export const CounterStore = signalStore(
  withState({
    count: 10,
    count2: 100,
    nested: {
      myval: 500
    }
  }),
  withStorage('state', sessionStorage),
  withMethods(({ count, ...store }) => ({
    increment(by: number) {
      patchState(store, { count: count() + by })
    },
    decrement(by: number) {
      patchState(store, { count: count() - by })
    }
  }))
)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  providers: [CounterStore],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  store = inject(CounterStore)

  constructor() {
    setTimeout(() => this.store.increment(100), 3000)
    // setTimeout(() => this.store.increment(100), 4000)
    // setTimeout(() => this.store.increment(100), 6000)
  }
}
