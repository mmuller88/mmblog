import { loadFont as loadDisplay } from '@remotion/google-fonts/BricolageGrotesque'
import { loadFont as loadSerif } from '@remotion/google-fonts/InstrumentSerif'
import { loadFont as loadMono } from '@remotion/google-fonts/JetBrainsMono'

loadDisplay('normal', { weights: ['500', '700', '800'], subsets: ['latin'] })
loadSerif('italic', { weights: ['400'], subsets: ['latin'] })
loadMono('normal', { weights: ['500', '700'], subsets: ['latin'] })
