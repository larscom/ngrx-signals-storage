export class NoopStorage implements Storage {
  length = -1
  clear = () => {}
  getItem = (_key: string) => null
  key = (_index: number) => null
  removeItem = (_key: string) => {}
  setItem = (_key: string, _value: string) => {}
}

function isBrowser() {
  return typeof window !== 'undefined'
}

/**
 * Helper function for SSR (Server Side Rendered) apps to get a storage location.
 *
 * @example
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
export function getStorage(storageType: 'localStorage' | 'sessionStorage'): Storage {
  switch (storageType) {
    case 'localStorage': {
      return isBrowser() ? window.localStorage : new NoopStorage()
    }
    case 'sessionStorage': {
      return isBrowser() ? window.sessionStorage : new NoopStorage()
    }
    default: {
      return new NoopStorage()
    }
  }
}
