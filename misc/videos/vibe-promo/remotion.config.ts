import { Config } from '@remotion/cli/config'
import { enableTailwind } from '@remotion/tailwind-v4'

Config.setEntryPoint('./src/index.ts')
Config.setVideoImageFormat('jpeg')
Config.setJpegQuality(80)
Config.setCodec('h264')
Config.setCrf(23)
Config.setX264Preset('slow')
Config.setPixelFormat('yuv420p')
Config.setOverwriteOutput(true)
Config.overrideWebpackConfig((config) => enableTailwind(config))
