import { loadFont as loadDisplay } from '@remotion/google-fonts/ChakraPetch'
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono'

loadDisplay('normal', { weights: ['500', '700'], subsets: ['latin'] })
loadDisplay('italic', { weights: ['700'], subsets: ['latin'] })
loadMono('normal', { weights: ['500', '700'], subsets: ['latin'] })
