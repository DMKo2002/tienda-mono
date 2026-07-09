/**
 * Set de íconos "boxed" (cuadro redondeado + glifo) del nuevo diseño de Tienda Mono.
 * Se usan en el Navbar/Hero — distintos del set de íconos ya existente en el Footer.
 */

const boxProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
} as const

export function IconInstagram() {
  return (
    <svg {...boxProps} xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="15" height="15" rx="3" />
      <circle cx="8" cy="8" r="3" />
    </svg>
  )
}

export function IconFacebook() {
  return (
    <svg {...boxProps} xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="15" height="15" rx="3" />
      <path
        d="M9.6 5.4H8.7c-.66 0-1.2.54-1.2 1.2v1h1.9l-.25 1.6H7.5V13H5.9V9.2H5V7.6h.9v-1c0-1.49 1.21-2.7 2.7-2.7h1v1.5Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

export function IconTikTok() {
  return (
    <svg {...boxProps} xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="15" height="15" rx="3" />
      <path
        d="M9.8 3.8c.22.9.86 1.62 1.7 1.9v1.4a3.4 3.4 0 0 1-1.7-.55v2.98A2.63 2.63 0 1 1 7.4 6.9v1.42a1.25 1.25 0 1 0 .9 1.2V3.8h1.5Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

export function IconCartMono() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5.5 3 2h8l1 3.5" />
      <path d="M1.3 5.5h11.4l-.9 9.2a1 1 0 0 1-1 .8H3.2a1 1 0 0 1-1-.8L1.3 5.5Z" />
    </svg>
  )
}

export function IconUserMono() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="5.3" r="2.6" />
      <path d="M2.5 14c.8-2.7 3-4.2 5.5-4.2S12.7 11.3 13.5 14" />
    </svg>
  )
}

export function IconArrowMono({ className = '' }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 2.5 11 7.5l-5.5 5" />
    </svg>
  )
}
