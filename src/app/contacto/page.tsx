import { createServerSupabase, TENANT_ID } from '@/lib/supabase-server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'Contacto' }

interface Branch { name: string; address: string; phone?: string }

function IconWhatsApp({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 21l3.98-.927A9.945 9.945 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.5a8.46 8.46 0 0 1-4.337-1.195l-.31-.184-3.22.75.77-3.12-.202-.32A8.5 8.5 0 1 1 12 20.5z"/>
    </svg>
  )
}

function IconInstagram({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function IconFacebook({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function IconTikTok({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.93a8.16 8.16 0 0 0 4.78 1.52V7.01a4.85 4.85 0 0 1-1.01-.32z"/>
    </svg>
  )
}

function IconMail({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

export default async function ContactPage() {
  const supabase = await createServerSupabase()
  const [{ data: tenant }, { data: config }] = await Promise.all([
    supabase.from('tenants').select('name').eq('id', TENANT_ID).single(),
    supabase.from('store_config')
      .select('logo_url, whatsapp_number, notification_email, instagram_url, facebook_url, tiktok_url, store_address, pickup_address, branches')
      .eq('tenant_id', TENANT_ID).single(),
  ])

  const storeName = tenant?.name ?? 'TIENDA'
  const branches: Branch[] = (config as any)?.branches ?? []
  const whatsapp = config?.whatsapp_number ?? ''
  const email = config?.notification_email ?? ''
  const instagram = (config as any)?.instagram_url ?? ''
  const facebook = (config as any)?.facebook_url ?? ''
  const tiktok = (config as any)?.tiktok_url ?? ''
  const storeAddress = (config as any)?.store_address ?? ''
  const pickupAddress = (config as any)?.pickup_address ?? ''

  const socialLinks = [
    whatsapp && {
      href: `https://wa.me/${whatsapp.replace(/\D/g, '')}`,
      label: 'WhatsApp',
      sublabel: whatsapp,
      icon: <IconWhatsApp size={22} />,
      bg: 'bg-[#25D366]',
    },
    instagram && {
      href: instagram,
      label: 'Instagram',
      sublabel: instagram.replace('https://instagram.com/', '@').replace('https://www.instagram.com/', '@'),
      icon: <IconInstagram size={22} />,
      bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
    },
    facebook && {
      href: facebook,
      label: 'Facebook',
      sublabel: facebook.replace('https://facebook.com/', '').replace('https://www.facebook.com/', ''),
      icon: <IconFacebook size={22} />,
      bg: 'bg-[#1877F2]',
    },
    tiktok && {
      href: tiktok,
      label: 'TikTok',
      sublabel: tiktok.replace('https://tiktok.com/', '').replace('https://www.tiktok.com/', ''),
      icon: <IconTikTok size={22} />,
      bg: 'bg-zinc-900',
    },
    email && {
      href: `mailto:${email}`,
      label: 'Email',
      sublabel: email,
      icon: <IconMail size={22} />,
      bg: 'bg-[var(--color-charcoal)]',
    },
  ].filter(Boolean) as { href: string; label: string; sublabel: string; icon: React.ReactNode; bg: string }[]

  return (
    <>
      <Navbar storeName={storeName} logoUrl={config?.logo_url} />

      <main className="pt-32 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 pb-24">

          {/* Encabezado */}
          <div className="mb-16">
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-stone)] mb-3">Contacto</p>
            <h1 className="font-display text-5xl font-light text-[var(--color-charcoal)] leading-tight">
              Escribinos,<br />estamos para ayudarte.
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Columna izquierda: botones sociales */}
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-6">Canales de contacto</p>
              <div className="space-y-3">
                {socialLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl text-white transition-opacity hover:opacity-90 ${link.bg}`}
                  >
                    <span className="flex-shrink-0">{link.icon}</span>
                    <div>
                      <p className="text-sm font-medium tracking-wide">{link.label}</p>
                      {link.sublabel && (
                        <p className="text-xs text-white/70 mt-0.5 truncate">{link.sublabel}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>

              {/* Dirección del local */}
              {storeAddress && (
                <div className="mt-10">
                  <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-3">Dirección</p>
                  <p className="text-sm text-[var(--color-stone)] font-light leading-relaxed">{storeAddress}</p>
                </div>
              )}

              {/* Sucursales */}
              {branches.length > 0 && (
                <div className="mt-10">
                  <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-4">Sucursales</p>
                  <div className="space-y-5">
                    {branches.map((b, i) => (
                      <div key={i} className="border-l-2 border-[var(--color-border)] pl-4">
                        {b.name && <p className="text-sm font-medium text-[var(--color-charcoal)] mb-0.5">{b.name}</p>}
                        {b.address && <p className="text-xs text-[var(--color-stone)] font-light">{b.address}</p>}
                        {b.phone && <p className="text-xs text-[var(--color-stone)] font-light mt-0.5">{b.phone}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Columna derecha: mapa */}
            {pickupAddress && (
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-4">Punto de retiro</p>
                <p className="text-sm text-[var(--color-stone)] font-light mb-4">{pickupAddress}</p>
                <div className="rounded-2xl overflow-hidden border border-[var(--color-border)]" style={{ height: '400px' }}>
                  <iframe
                    title="Mapa punto de retiro"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(pickupAddress)}&output=embed&z=15`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* Si no hay pickup address pero sí hay store address, mostrar mapa igual */}
            {!pickupAddress && storeAddress && (
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] mb-4">Dónde encontrarnos</p>
                <div className="rounded-2xl overflow-hidden border border-[var(--color-border)]" style={{ height: '400px' }}>
                  <iframe
                    title="Mapa"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(storeAddress)}&output=embed&z=15`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer
        storeName={storeName}
        logoUrl={config?.logo_url ?? undefined}
        whatsapp={whatsapp}
        email={email}
        instagramUrl={instagram || undefined}
        facebookUrl={facebook || undefined}
        tiktokUrl={tiktok || undefined}
        branches={branches}
      />
    </>
  )
}
