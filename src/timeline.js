import { Vector3 } from 'three'

/**
 * Single source of truth for the scroll choreography.
 * The model is normalised so its widest horizontal dimension equals
 * MODEL.diameter, it's centred on X/Z, and it rests on y = 0.
 * All camera values below are in those world units, so tune here.
 */
export const MODEL = {
  url: '/cup-and-saucer.glb',
  diameter: 3,
}

export const KEYFRAMES = {
  // 0%: straight down into the cup
  top: {
    target: new Vector3(0, 0.5, 0),
    radius: 7.6,
    polar: 0.015, // radians from zenith (exactly 0 makes lookAt degenerate)
    fov: 30,
  },
  // 50%: side profile. Target shifted left so the cup sits right of the copy
  side: {
    target: new Vector3(-0.95, 0.75, 0),
    radius: 6.8,
    polar: 1.4,
    fov: 30,
  },
  // 100%: macro on the gilded front rim
  macro: {
    position: new Vector3(0.5, 1.75, 1.9),
    target: new Vector3(0.05, 1.42, 1.02),
    fov: 22,
  },
}

// Page-2 midpoint where the orbit hands off to the dolly
export const MIDPOINT = 0.5
