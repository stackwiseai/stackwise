import type { PluginCreator } from 'postcss'
import type { Config } from 'tailwindcss/types/config'

declare const plugin: PluginCreator<string | Config | { config: string | Config }>

declare type _Config = Config
declare namespace plugin {
  export type { _Config as Config }
}

export = plugin
