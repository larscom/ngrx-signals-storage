import { TestBed } from '@angular/core/testing'
import { signalStore, withState } from '@ngrx/signals'
import { withStorage } from './with-storage'

const storageKey = 'key'

describe('withStorage', () => {
  it('should save to storage', () => {
    const storage = new TestStorage()
    const TestStore = signalStore(
      withState({
        count: 0,
        todos: [
          {
            name: 'todo 1',
            done: false,
            date: new Date('2023-01-01T01:00:00')
          },
          {
            name: 'todo 2',
            done: true,
            date: new Date('2023-01-01T01:00:00')
          }
        ]
      }),
      withStorage(storageKey, () => storage)
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })

    const store = TestBed.inject(TestStore)
    expect(store.count()).toBe(0)
    expect(store.todos()).toHaveLength(2)

    // trigger effect()
    TestBed.tick()

    expect(storage.length).toEqual(1)
    expect(JSON.parse(storage.getItem(storageKey)!)).toEqual({
      count: 0,
      todos: [
        {
          name: 'todo 1',
          done: false,
          date: '2023-01-01T00:00:00.000Z'
        },
        {
          name: 'todo 2',
          done: true,
          date: '2023-01-01T00:00:00.000Z'
        }
      ]
    })
  })

  it('should rehydrate from storage', () => {
    const storage = new TestStorage()
    storage.setItem(
      storageKey,
      JSON.stringify({
        count: 100,
        todos: [
          {
            name: 'todo 1',
            done: false,
            date: new Date('2023-01-01T01:00:00')
          },
          {
            name: 'todo 2',
            done: true,
            date: new Date('2023-01-01T01:00:00')
          }
        ]
      })
    )
    expect(storage.length).toEqual(1)

    const TestStore = signalStore(
      withState({
        count: 0,
        todos: []
      }),
      withStorage(storageKey, () => storage)
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })

    const store = TestBed.inject(TestStore)
    expect(store.count()).toBe(100)
    expect(store.todos()).toHaveLength(2)

    // trigger effect()
    TestBed.tick()

    expect(storage.length).toEqual(1)
    expect(JSON.parse(storage.getItem(storageKey)!)).toEqual({
      count: 100,
      todos: [
        {
          name: 'todo 1',
          done: false,
          date: '2023-01-01T00:00:00.000Z'
        },
        {
          name: 'todo 2',
          done: true,
          date: '2023-01-01T00:00:00.000Z'
        }
      ]
    })
  })

  it('should rehydrate boolean values from storage correctly', () => {
    const storage = new TestStorage()
    storage.setItem(storageKey, JSON.stringify({ playing: false }))

    const TestStore = signalStore(
      withState({
        playing: true
      }),
      withStorage(storageKey, () => storage)
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })

    const store = TestBed.inject(TestStore)
    expect(store.playing()).toBe(false)
  })

  it('should rehydrate array values from storage correctly', () => {
    const storage = new TestStorage()
    storage.setItem(storageKey, JSON.stringify({ items: [] }))

    const TestStore = signalStore(
      withState({
        items: [1, 2, 3]
      }),
      withStorage(storageKey, () => storage)
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })

    const store = TestBed.inject(TestStore)
    expect(store.items()).toHaveLength(0)
  })

  it('should ignore properties from storage if not exist on state', () => {
    const storage = new TestStorage()
    storage.setItem(storageKey, JSON.stringify({ count: 100, a: true, b: 0 }))

    const TestStore = signalStore(
      withState({
        count: 0
      }),
      withStorage(storageKey, () => storage)
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })

    const store = TestBed.inject(TestStore)
    expect(store.count()).toBe(100)

    // trigger effect()
    TestBed.tick()

    expect(storage.length).toEqual(1)
    expect(JSON.parse(storage.getItem(storageKey)!)).toEqual({ count: 100 })
  })

  it('should not save to storage when saveIf returns false', () => {
    const storage = new TestStorage()

    const TestStore = signalStore(
      withState({
        count: 0
      }),
      withStorage(storageKey, () => storage, { saveIf: ({ count }) => count > 0 })
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })

    const store = TestBed.inject(TestStore)
    expect(store.count()).toBe(0)

    // trigger effect()
    TestBed.tick()

    expect(storage.length).toEqual(0)
  })

  it('should call provided serialize func', () => {
    const storage = new TestStorage()

    const serialize = jest.fn()
    const TestStore = signalStore(
      withState({
        count: 0
      }),
      withStorage(storageKey, () => storage, { serialize })
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })

    const store = TestBed.inject(TestStore)
    expect(store.count()).toBe(0)

    // trigger effect()
    TestBed.tick()

    expect(serialize).toHaveBeenCalledWith({ count: 0 })
  })

  it('should call provided deserialize func', () => {
    const storage = new TestStorage()
    storage.setItem(storageKey, JSON.stringify({ count: 100 }))

    const deserialize = jest.fn()
    const TestStore = signalStore(
      withState({
        count: 0
      }),
      withStorage(storageKey, () => storage, { deserialize })
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })

    const store = TestBed.inject(TestStore)
    expect(store).toBeDefined()

    expect(deserialize).toHaveBeenCalledWith(JSON.stringify({ count: 100 }))
  })

  it('should call provided error func on getItem', () => {
    const storage = new TestStorage()

    jest.spyOn(storage, 'getItem').mockImplementation(() => {
      throw Error('storage error')
    })

    const error = jest.fn()
    const TestStore = signalStore(
      withState({
        count: 0
      }),
      withStorage(storageKey, () => storage, { error })
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })

    const store = TestBed.inject(TestStore)
    expect(store).toBeDefined()

    expect(error).toHaveBeenCalledWith(Error('storage error'))
  })

  it('should call provided error func on setItem', () => {
    const storage = new TestStorage()

    jest.spyOn(storage, 'setItem').mockImplementation(() => {
      throw Error('storage error')
    })

    const error = jest.fn()
    const TestStore = signalStore(
      withState({
        count: 0
      }),
      withStorage(storageKey, () => storage, { error })
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })

    const store = TestBed.inject(TestStore)
    expect(store.count()).toBe(0)

    // trigger effect()
    TestBed.tick()

    expect(error).toHaveBeenCalledWith(Error('storage error'))
  })

  it('should exclude keys from state when saving to storage', () => {
    const storage = new TestStorage()

    const TestStore = signalStore(
      withState({
        count: 100,
        excludeMe: 1,
        skipMe: 'test'
      }),
      withStorage(storageKey, () => storage, { excludeKeys: ['excludeMe', 'skipMe'] })
    )

    TestBed.configureTestingModule({
      providers: [TestStore]
    })

    const store = TestBed.inject(TestStore)
    expect(store.count()).toBe(100)
    expect(store.excludeMe()).toBe(1)
    expect(store.skipMe()).toBe('test')

    // trigger effect()
    TestBed.tick()

    expect(storage.length).toEqual(1)
    expect(JSON.parse(storage.getItem(storageKey)!)).toEqual({ count: 100 })
  })
})

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
