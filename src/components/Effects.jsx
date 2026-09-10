import {
  Bloom,
  DepthOfField,
  EffectComposer,
  N8AO,
  Noise,
  SMAA,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

/**
 * Lens and sensor response that sells the "photographed, not rendered" look.
 * `dofRef` is driven from the camera timeline so focus follows each shot.
 */
export default function Effects({ dofRef }) {
  return (
    <EffectComposer multisampling={0}>
      <N8AO aoRadius={0.5} distanceFalloff={0.6} intensity={2.4} quality="medium" halfRes />
      <DepthOfField ref={dofRef} target={[0, 0.75, 0]} worldFocusRange={2.6} bokehScale={3} />
      <Bloom mipmapBlur luminanceThreshold={0.95} luminanceSmoothing={0.2} intensity={0.3} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <SMAA />
      <Vignette offset={0.3} darkness={0.55} />
      <Noise premultiply opacity={0.12} />
    </EffectComposer>
  )
}
