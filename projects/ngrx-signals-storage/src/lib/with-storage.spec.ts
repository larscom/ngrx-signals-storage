import { TestBed } from '@angular/core/testing'
import { signalStore, withState } from '@ngrx/signals'
import { withStorage } from './with-storage'
import { Signal } from '@angular/core'

class TestStorage implements Storage {
  data = new Map<string, any>()

  get length(): number {
    return this.data.size
  }

  clear(): void {
    this.data.clear()
  }

  getItem(key: string): string | null {
    return this.data.get(key)
  }

  key(index: number): string {
    return Array.from(this.data.keys())[index]
  }

  removeItem(key: string): void {
    this.data.delete(key)
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value)
  }
}

describe('withStorage', () => {
  const key = 'state'

  let store: { count: Signal<number> }
  let storage: Storage

  beforeEach(async () => {
    storage = new TestStorage()
    const TestStore = signalStore(
      withState({
        count: 0
      }),
      withStorage(key, storage)
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })
    store = TestBed.inject(TestStore)
  })

  it('should save to storage', () => {
    expect(store.count()).toBe(0)

    // trigger effect()
    TestBed.flushEffects()

    expect(storage.length).toEqual(1)
    expect(JSON.parse(storage.getItem(key)!)).toEqual({ count: 0 })
  })
})
