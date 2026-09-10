# CupNSaucer — The Perfect Pour

An immersive, scroll-driven 3D landing page built with React, React Three Fiber, Drei, framer-motion and Tailwind CSS.

Scrolling moves the camera from a top-down view into the cup, arcs down to a side profile while the cup and saucer turn 180°, then pushes in to a macro close-up of the rim.

## Getting started

```bash
npm install
npm run dev
```

Build for production with `npm run build` and preview it with `npm run preview`.

## Project structure

- `src/App.jsx`: canvas, scroll controls, loading gate, header
- `src/timeline.js`: camera keyframes for the scroll choreography (tune shots here)
- `src/components/Scene.jsx`: environment, lighting, shadows, camera timeline, focus pull
- `src/components/Effects.jsx`: post-processing (AO, depth of field, bloom, tone mapping, grain)
- `src/components/Overlay.jsx`: HTML text sections
- `src/components/CupAndSaucer.jsx`: GLTF model loader
- `src/components/Table.jsx`: textured wooden tabletop
- `src/components/ProceduralCup.jsx`: fallback cup shown if the model fails to load

## Asset credits

All 3D assets are from [Poly Haven](https://polyhaven.com) and licensed CC0:

- [Tea Set 01](https://polyhaven.com/a/tea_set_01): one cup and saucer extracted into `public/cup-and-saucer.glb`
- [Comfy Café](https://polyhaven.com/a/comfy_cafe) HDRI: `public/hdri/comfy_cafe_2k.hdr`
- [Kitchen Wood](https://polyhaven.com/a/kitchen_wood) texture: `public/textures/kitchen_wood/`
