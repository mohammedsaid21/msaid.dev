import { useEffect, useRef, type CSSProperties } from 'react'

/**
 * Custom animated WebGL "shader" — a flowing, domain-warped color field in the
 * brand palette (indigo → violet → fuchsia). Inspired by amplemarket's hero
 * shader but fully self-contained (our own GLSL, our own colors — no third-party
 * assets or scripts).
 *
 * Rendered only on desktop (≥1024px) and when the user allows motion, to keep
 * mobile/battery and accessibility in check.
 */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  float a = hash(i), b = hash(i+vec2(1.0,0.0)), c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_res.x / u_res.y;
  float t = u_time * 0.06;
  vec2 q = vec2(fbm(p + vec2(t, 0.0)), fbm(p + vec2(0.0, t) + vec2(5.2, 1.3)));
  float n = clamp(smoothstep(0.05, 0.95, fbm(p + q * 1.6)), 0.0, 1.0);
  vec3 col = mix(u_c1, u_c2, n);
  col = mix(col, u_c3, smoothstep(0.45, 0.95, fbm(p * 1.4 - vec2(t, 0.0))));
  gl_FragColor = vec4(col, 1.0);
}
`

export function HeroShader({
  className = '',
  style,
  colors,
}: {
  className?: string
  style?: CSSProperties
  colors?: [string, string, string]
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 1024px)').matches) return

    const canvas = ref.current
    if (!canvas) return
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as
      | WebGLRenderingContext
      | null
    if (!gl) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const posLoc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const hex = (h: string): [number, number, number] => {
      const n = parseInt(h.slice(1), 16)
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255) as [number, number, number]
    }
    const [c1, c2, c3] = colors ?? ['#6366f1', '#8b5cf6', '#ec4899']
    const a = hex(c1)
    const b = hex(c2)
    const d = hex(c3)
    gl.uniform3f(gl.getUniformLocation(prog, 'u_c1')!, a[0], a[1], a[2])
    gl.uniform3f(gl.getUniformLocation(prog, 'u_c2')!, b[0], b[1], b[2])
    gl.uniform3f(gl.getUniformLocation(prog, 'u_c3')!, d[0], d[1], d[2])

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const start = performance.now()
    let raf = 0
    const frame = () => {
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(frame)
    }
    frame()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className={className} style={style} />
}
