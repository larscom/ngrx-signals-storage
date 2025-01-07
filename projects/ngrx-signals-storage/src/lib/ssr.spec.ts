import { getStorage, NoopStorage } from './ssr'

describe('getStorage', () => {
  const { window } = global

  beforeEach(() => {
    // @ts-ignore
    delete global.window
  })

  afterEach(() => {
    global.window = window
  })

  it('should return window.localStorage if running in the browser and StorageType is LocalStorage', () => {
    global.window = { localStorage: jest.fn(), sessionStorage: jest.fn() } as any

    const storage = getStorage('localStorage')
    expect(storage).toBe(global.window.localStorage)
  })

  it('should return window.sessionStorage if running in the browser and StorageType is SessionStorage', () => {
    global.window = { localStorage: jest.fn(), sessionStorage: jest.fn() } as any

    const storage = getStorage('sessionStorage')
    expect(storage).toBe(global.window.sessionStorage)
  })

  it('should return NoopStorage if not running in the browser and StorageType is LocalStorage', () => {
    global.window = undefined as any

    const storage = getStorage('localStorage')
    expect(storage).toBeInstanceOf(NoopStorage)
  })

  it('should return NoopStorage if not running in the browser and StorageType is SessionStorage', () => {
    global.window = undefined as any

    const storage = getStorage('sessionStorage')
    expect(storage).toBeInstanceOf(NoopStorage)
  })

  it('should return NoopStorage for an unknown StorageType', () => {
    global.window = undefined as any

    const storage = getStorage('' as any)
    expect(storage).toBeInstanceOf(NoopStorage)
  })
})
