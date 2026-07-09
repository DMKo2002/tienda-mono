import { cookies } from 'next/headers'
import { createServerSupabase, TENANT_ID } from '@/lib/supabase-server'

// Siempre SSR fresco — sin esto Next.js cachea la página y los cambios del panel no se ven
export const dynamic = 'force-dynamic'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/shop/ProductCard'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, RotateCcw, Headset } from 'lucide-react'
import { IconArrowMono } from '@/components/icons/SocialIcons'

export default async function HomePage() {
  // cookies() debe llamarse ANTES de cualquier await
  const cookieStore = cookies()
  const isLoggedIn = cookieStore.getAll().some(c => c.name.includes('-auth-token') && c.value.length > 10)

  const supabase = await createServerSupabase()

  // Datos de la tienda
  const { data: tenant } = await supabase
    .from('tenants')
    .select('name, domain')
    .eq('id', TENANT_ID())
    .single()

  const { data: config } = await supabase
    .from('store_config')
    .select('logo_url, hero_image_url, hero_eyebrow, hero_title_line1, hero_title_italic, hero_title_line3, hero_subtitle, hero_season, hero_text_color, whatsapp_number, notification_email, instagram_url, facebook_url, tiktok_url, pickup_address, pickup_enabled, branches, price_visibility')
    .eq('tenant_id', TENANT_ID())
    .single()

  // Imágenes configurables desde panel Personalización
  const { data: assetsRows } = await supabase
    .from('store_assets')
    .select('slot, url')
    .eq('tenant_id', TENANT_ID())

  const asset = (slot: string): string | null =>
    assetsRows?.find(a => a.slot === slot)?.url ?? null

  // Productos destacados (últimos 4)
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, product_images(*), variants(price_rules(*))')
    .eq('tenant_id', TENANT_ID())
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  const storeName = tenant?.name ?? 'TIENDA'
  const priceVisibility = (config as any)?.price_visibility ?? 'all'
  const showPrices = priceVisibility === 'all' || (priceVisibility === 'logged_in' && isLoggedIn)

  return (
    <>
      <Navbar
        storeName={storeName}
        logoUrl={config?.logo_url}
        instagramUrl={(config as any)?.instagram_url ?? undefined}
        facebookUrl={(config as any)?.facebook_url ?? undefined}
        tiktokUrl={(config as any)?.tiktok_url ?? undefined}
      />

      <main>

        {/* ── HERO ─────────────────────────────────────────────── */}
        {/* Proporciones del diseño: lienzo 1728×1117, columna izquierda 428px (24.77%), imagen 1300×975 (75.23% × 87.3%) */}
        <section className="relative bg-[var(--color-cream)] flex flex-col lg:grid lg:grid-cols-[24.77%_75.23%] lg:grid-rows-1 lg:aspect-[1728/1117]">

            {/* Columna izquierda — logo del tenant, tagline y CTA (el grid la estira al 100% de la fila) */}
            <div className="order-2 lg:order-1 w-full flex flex-col justify-between gap-10 px-8 py-12 lg:px-10 lg:py-16">

              <div className="flex justify-center opacity-0 animate-fade-in delay-100">
                {config?.logo_url ? (
                  <img
                    src={config.logo_url}
                    alt={storeName}
                    className="max-h-[180px] max-w-[200px] object-contain"
                  />
                ) : (
                  <div className="w-[200px] max-w-full h-[180px] border border-dashed border-[var(--color-charcoal)]/30 flex items-center justify-center">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[var(--color-stone)] text-center px-4">
                      Logo de la tienda
                    </span>
                  </div>
                )}
              </div>

              <div className="opacity-0 animate-fade-up delay-200">
                <p className="font-display text-lg leading-snug text-[var(--color-charcoal)] mb-8 whitespace-pre-line">
                  {(config as any)?.hero_subtitle ?? 'Piezas únicas diseñadas para\nquienes buscan estilo y distinción.'}
                </p>

                <div className="flex items-center gap-5 flex-wrap">
                  <Link
                    href="/tienda"
                    className="inline-flex items-center justify-center bg-[var(--color-charcoal)] text-white text-xs tracking-[0.15em] uppercase px-7 py-3 hover:opacity-90 transition-opacity"
                  >
                    Ver colección
                  </Link>
                  <Link
                    href="/tienda"
                    className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)] pb-1 hover:text-[var(--color-stone)] hover:border-[var(--color-stone)] transition-colors"
                  >
                    Tienda <IconArrowMono />
                  </Link>
                </div>
              </div>
            </div>

            {/* Columna derecha — celda del grid al 100% de la fila; la imagen ocupa 87.3% de esa altura, alineada arriba */}
            <div className="order-1 lg:order-2 w-full">
              <div
                className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[87.3%] flex items-end overflow-hidden bg-[#EDE8E1]"
                style={config?.hero_image_url ? {
                  backgroundImage: `url(${config.hero_image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : undefined}
              >
                {config?.hero_image_url && (
                  <div className="absolute inset-0 bg-black/20" />
                )}

                {(() => {
                  const customColor = (config as any)?.hero_text_color
                  const textStyle = customColor ? { color: customColor } : undefined
                  const defaultEyebrowClass = config?.hero_image_url ? 'text-white/80' : 'text-[var(--color-stone)]'
                  const defaultTitleClass   = config?.hero_image_url ? 'text-white'    : 'text-[var(--color-charcoal)]'
                  return (
                    <div className="relative z-10 px-8 pb-14 lg:px-16 lg:pb-20 opacity-0 animate-fade-up delay-100">
                      <p
                        className={`text-xs tracking-[0.25em] uppercase mb-4 ${!customColor ? defaultEyebrowClass : ''}`}
                        style={textStyle ? { color: customColor + 'B3' } : undefined}
                      >
                        {(config as any)?.hero_eyebrow ?? 'Opening New Season Summer 2026'}
                      </p>
                      <h1
                        className={`font-display text-5xl md:text-7xl font-semibold leading-[1.05] ${!customColor ? defaultTitleClass : ''}`}
                        style={textStyle}
                      >
                        {(config as any)?.hero_title_line1 ?? 'Timeless Design'}<br />
                        <em className="italic font-normal">{(config as any)?.hero_title_italic ?? 'Beyond Trends'}</em>
                        {(config as any)?.hero_title_line3 && <><br />{(config as any).hero_title_line3}</>}
                      </h1>
                    </div>
                  )
                })()}
              </div>
            </div>

        </section>

        {/* ── TRUST BADGES ─────────────────────────────────────── */}
        <section className="w-full px-6 py-14 border-b border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Envío gratis', text: 'En compras que superen el monto mínimo. Entrega rápida y segura a todo el país.' },
              { icon: RotateCcw, title: 'Devoluciones', text: 'Tenés 14 días para devolver o cambiar tu pedido si no quedás satisfecho.' },
              { icon: Headset, title: 'Atención al cliente', text: 'Estamos disponibles para ayudarte en todo momento por WhatsApp y email.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--color-cream)] text-[var(--color-charcoal)]">
                  <Icon size={18} strokeWidth={1.25} />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-[0.1em] uppercase text-[var(--color-charcoal)] mb-1">{title}</p>
                  <p className="text-xs text-[var(--color-stone)] leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── NEW ARRIVALS ──────────────────────────────────────── */}
        {products && products.length > 0 && (
          <section className="w-full px-6 py-24 text-center">
            <h2 className="font-display text-4xl font-semibold text-[var(--color-charcoal)] mb-2">
              New Arrivals
            </h2>
            <p className="text-sm text-[var(--color-stone)] mb-10">
              {(config as any)?.hero_eyebrow ?? 'Opening New Season - Summer 2026'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              {products.slice(0, 4).map((product: any) => {
                const cover = product.product_images?.find((img: any) => img.is_cover) ?? product.product_images?.[0]
                return (
                  <Link key={product.id} href={`/tienda/${product.slug}`} className="product-img-wrap block aspect-[2/3] relative bg-[#F2EEE9] overflow-hidden">
                    {cover?.url && (
                      <Image
                        src={cover.url.split('?')[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── FEATURED COLLECTION ──────────────────────────────── */}
        <section className="w-full px-6 py-24">

          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-stone)] mb-2">
                Selección
              </p>
              <h2 className="font-display text-4xl font-light text-[var(--color-charcoal)]">
                Featured Collection
              </h2>
            </div>
            <Link
              href="/tienda"
              className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[var(--color-stone)] hover:text-[var(--color-charcoal)] transition-colors"
            >
              Ver todo <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products?.map((product: any, i: number) => {
              const cover = product.product_images?.find((img: any) => img.is_cover) ?? product.product_images?.[0]
              const retailPrice = product.variants?.[0]?.price_rules?.find((p: any) => p.type === 'retail' && p.active)?.price
              const wholesalePrice = product.variants?.[0]?.price_rules?.find((p: any) => p.type === 'wholesale' && p.active)?.price

              const colors = [...new Set((product.variants ?? []).map((v: any) => v.color).filter(Boolean))] as string[]
              const sizes = [...new Set((product.variants ?? []).map((v: any) => v.size).filter(Boolean))] as string[]

              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  coverUrl={cover?.url}
                  retailPrice={retailPrice}
                  wholesalePrice={wholesalePrice}
                  showPrices={showPrices}
                  priceVisibility={priceVisibility}
                  colors={colors}
                  sizes={sizes}
                  index={i}
                />
              )
            })}

            {(!products || products.length === 0) && (
              <div className="col-span-4 py-20 text-center">
                <p className="text-[var(--color-stone)] font-light">
                  Los productos se mostrarán aquí
                </p>
              </div>
            )}
          </div>

          {/* Mobile ver todo */}
          <div className="mt-10 text-center md:hidden">
            <Link href="/tienda" className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[var(--color-stone)]">
              Ver todos los productos <ArrowRight size={13} />
            </Link>
          </div>

        </section>

        {/* ── BANNER INTERMEDIO ────────────────────────────────── */}
        <section className="bg-[var(--color-charcoal)] py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-6">Los Destacados</p>
            <h2 className="font-display text-5xl md:text-6xl font-light italic text-white leading-tight mb-8">
              Conocé productos especialmente<br />elegidos para vos
            </h2>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-white border-b border-white/30 pb-1 hover:border-white transition-colors"
            >
              Shop now <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* ── MOODBOARD ────────────────────────────────────────── */}
        <section className="w-full px-6 py-24">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--color-stone)] mb-2">Instagram</p>
            <h2 className="font-display text-3xl font-light text-[var(--color-charcoal)]">MoodBoard</h2>
            <p className="text-sm text-[var(--color-stone)] mt-2 font-light">
              Descubrí nuestras selecciones diseñadas para destacar, redefiniendo la elegancia contemporánea
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['#DDD5C8', '#C8CDD5', '#C8D5CC', '#D5C8CE'].map((bg, i) => {
              const imgUrl = asset(`moodboard_${i + 1}`)
              return (
                <div
                  key={i}
                  className="aspect-square overflow-hidden opacity-0 animate-fade-up relative"
                  style={{
                    backgroundColor: bg,
                    animationDelay: `${i * 100}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {imgUrl && (
                    <Image
                      src={imgUrl.split('?')[0]}
                      alt={`Mood ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </section>

      </main>

      {/* ── WHATSAPP FLOTANTE ─────────────────────────────────── */}
      {config?.whatsapp_number && (
        <a
          href={`https://wa.me/${config.whatsapp_number.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="fixed bottom-12 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 21l3.98-.927A9.945 9.945 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.5a8.46 8.46 0 0 1-4.337-1.195l-.31-.184-3.22.75.77-3.12-.202-.32A8.5 8.5 0 1 1 12 20.5z"/>
          </svg>
        </a>
      )}

      <Footer
        storeName={storeName}
        logoUrl={asset('logo') ?? config?.logo_url ?? undefined}
        whatsapp={config?.whatsapp_number ?? ''}
        email={config?.notification_email ?? ''}
        instagramUrl={(config as any)?.instagram_url ?? undefined}
        facebookUrl={(config as any)?.facebook_url ?? undefined}
        tiktokUrl={(config as any)?.tiktok_url ?? undefined}
        branches={(config as any)?.branches ?? []}
      />
    </>
  )
}
