import QRCode from 'qrcode'
import { useMemo } from 'react'

/** Scannable QR code rendered as a single SVG path. */
export const Qr: React.FC<{ value: string; size: number; className?: string }> = ({ value, size, className = 'fill-navy' }) => {
  const { d, n } = useMemo(() => {
    const { modules } = QRCode.create(value, { errorCorrectionLevel: 'M' })
    let path = ''
    for (let y = 0; y < modules.size; y++) {
      for (let x = 0; x < modules.size; x++) {
        if (modules.get(y, x)) path += `M${x} ${y}h1v1h-1z`
      }
    }
    return { d: path, n: modules.size }
  }, [value])

  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} shapeRendering="crispEdges">
      <path d={d} className={className} />
    </svg>
  )
}
