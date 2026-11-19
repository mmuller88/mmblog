import type { City } from '../script'

const DEG = Math.PI / 180

export type Vec3 = [number, number, number]

export const toVec = (lon: number, lat: number): Vec3 => {
  const l = lon * DEG
  const p = lat * DEG
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)]
}

/** Orthographic view coordinates for a globe centred on lon0/lat0. z > 0 faces the camera. */
export const orthographic = (v: Vec3, lon0: number, lat0: number) => {
  const l0 = lon0 * DEG
  const p0 = lat0 * DEG
  const x1 = v[0] * Math.cos(l0) + v[1] * Math.sin(l0)
  const y1 = -v[0] * Math.sin(l0) + v[1] * Math.cos(l0)
  return {
    x: y1,
    y: Math.cos(p0) * v[2] - Math.sin(p0) * x1,
    z: Math.sin(p0) * v[2] + Math.cos(p0) * x1,
  }
}

export const projectCity = (c: Pick<City, 'lon' | 'lat'>, lon0: number, lat0: number) =>
  orthographic(toVec(c.lon, c.lat), lon0, lat0)

/** Great-circle arc from a to b, lifted off the surface towards the middle. */
export const liftedArc = (a: City, b: City, steps = 40): Vec3[] => {
  const va = toVec(a.lon, a.lat)
  const vb = toVec(b.lon, b.lat)
  const omega = Math.acos(Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2])))
  const lift = 0.06 + 0.22 * (omega / Math.PI)
  const s = Math.sin(omega)
  const points: Vec3[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const wa = Math.sin((1 - t) * omega) / s
    const wb = Math.sin(t * omega) / s
    const h = 1 + lift * Math.sin(Math.PI * t)
    points.push([
      (wa * va[0] + wb * vb[0]) * h,
      (wa * va[1] + wb * vb[1]) * h,
      (wa * va[2] + wb * vb[2]) * h,
    ])
  }
  return points
}
