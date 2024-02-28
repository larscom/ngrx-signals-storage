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
  saveIf: (state: T) => boolean

  /**
   * These keys will not get saved to storage
   */
  excludeKeys: Array<keyof T>
}

export const defaultConfig: Config<any> = {
  error: (error: any) => console.error(error),

  serialize: (state: any) => JSON.stringify(state),

  deserialize: (state: string) => JSON.parse(state),

  saveIf: (state: any) => true,

  excludeKeys: []
}
