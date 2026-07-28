import { ArchFlow, ArchNode } from '../data/resume';

/** A node positioned in canvas coordinates (centre point `cx`/`cy`). */
export interface LaidNode extends ArchNode { cx: number; cy: number; }

/** An edge resolved to an SVG cubic-bézier path plus its packet animation timing. */
export interface LaidEdge {
  id: string; d: string; from: string; to: string;
  bidir: boolean; dur: number; delay: number;
}

/* Canvas geometry — the diagram is laid out against these fixed dimensions and
   scaled responsively by the SVG viewBox. Node x/y in ARCH_FLOWS are percentages. */
export const ARCH_W = 1200;
export const ARCH_H = 470;
export const BOX_W = 150;
export const BOX_H = 56;
const PADX = 80;
const PADY = 56;

/** Resolve each flow node's percentage position to an absolute centre point. */
export function layoutNodes(flow: ArchFlow): LaidNode[] {
  return flow.nodes.map((n) => ({
    ...n,
    cx: PADX + (n.x / 100) * (ARCH_W - 2 * PADX),
    cy: PADY + (n.y / 100) * (ARCH_H - 2 * PADY),
  }));
}

/**
 * Build the SVG path for every edge of a flow. Edges enter/leave nodes
 * horizontally, so each end is trimmed to the box's left/right border (+ a small
 * gap) — packets then sit in the open space between nodes instead of hiding under
 * the boxes. Edges leaving a shared source are fanned vertically so they don't
 * stack, while the arrival stays centred on the target.
 */
export function layoutEdges(flow: ArchFlow, nodes: LaidNode[], flowId: string): LaidEdge[] {
  const map = new Map(nodes.map((n) => [n.id, n]));
  const trim = BOX_W / 2 + 6;
  const FAN = 13; // vertical spread at a shared source
  return flow.edges.map((e, i) => {
    const a = map.get(e.from)!, b = map.get(e.to)!;
    const s = b.cx >= a.cx ? 1 : -1;
    const dyAB = b.cy - a.cy;
    const bias = Math.abs(dyAB) > 4 ? Math.sign(dyAB) * FAN : 0;
    const ax = a.cx + s * trim, bx = b.cx - s * trim;
    // Fan out at the source; arrive centred on the target so the arrowhead meets
    // the box squarely. A long horizontal tail (0.5) keeps the arrow flat even
    // when the target is well above/below the source.
    const ay = a.cy + bias, by = b.cy;
    const dx = (bx - ax) * 0.5;
    return {
      id: `edge-${flowId}-${i}`,
      from: e.from, to: e.to, bidir: !!e.bidir,
      d: `M ${ax} ${ay} C ${ax + dx} ${ay}, ${bx - dx} ${by}, ${bx} ${by}`,
      dur: 2.4 + (i % 3) * 0.6,
      delay: (i % 4) * 0.45,
    };
  });
}
