import { Component } from 'react'

/** Swaps in `fallback` if the GLTF fails to load, instead of crashing the Canvas. */
export default class ModelBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('[CupNSaucer] Model failed to load, using procedural fallback.', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
