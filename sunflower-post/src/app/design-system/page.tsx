'use client';

import { Sparkles, Heart, Calendar } from 'lucide-react';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--soft-cream)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1
            className="font-bold"
            style={{
              fontSize: '2rem',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-serif)'
            }}
          >
            🌻 The Sunflower Post Design System
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '42rem', margin: '0 auto' }}>
            A warm, emotionally safe, nature-inspired design language for a premium but welcoming wellness experience
          </p>
        </header>

        {/* Color Palette */}
        <section className="space-y-6">
          <div>
            <h2
              className="font-semibold mb-2"
              style={{
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-serif)'
              }}
            >
              Color Palette
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Warm, nature-inspired colors for emotional safety and grounding
            </p>
          </div>

          {/* Primary Brand Colors */}
          <div>
            <h3 className="font-semibold mb-4" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
              Primary Brand Colors
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-soft)' }}>
                <div className="h-32" style={{ background: 'var(--soft-cream)' }}></div>
                <div className="p-4 bg-white">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Soft Cream</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>#FAF6F0</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Main backgrounds</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-soft)' }}>
                <div className="h-32" style={{ background: 'var(--sunflower-gold)' }}></div>
                <div className="p-4 bg-white">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Sunflower Gold</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>#F3C969</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Primary CTAs, accents</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-soft)' }}>
                <div className="h-32" style={{ background: 'var(--deep-soil)' }}></div>
                <div className="p-4 bg-white">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Deep Soil Brown</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>#5C4A3E</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Primary text, headers</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-soft)' }}>
                <div className="h-32" style={{ background: 'var(--forest-green)' }}></div>
                <div className="p-4 bg-white">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Forest Green</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>#254331</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Navigation, premium moments</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-soft)' }}>
                <div className="h-32" style={{ background: 'var(--sage-green)' }}></div>
                <div className="p-4 bg-white">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Sage Green</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>#C7D7C1</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Secondary buttons, hover states</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-soft)' }}>
                <div className="h-32" style={{ background: 'var(--rose-beige)' }}></div>
                <div className="p-4 bg-white">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Rose Beige</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>#E7D4CE</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Tags, subtle accents</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-soft)' }}>
                <div className="h-32" style={{ background: 'var(--lavender-dust)' }}></div>
                <div className="p-4 bg-white">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Lavender Dust</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>#C9C3D8</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Special cards, highlights</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <div>
            <h2
              className="font-semibold mb-2"
              style={{
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-serif)'
              }}
            >
              Typography
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Nunito for UI clarity, DM Serif Display for emotional moments
            </p>
          </div>

          <div className="rounded-xl p-8 space-y-6" style={{ background: 'white', border: '1px solid var(--border-soft)' }}>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>HEADING 1 (SERIF, BOLD, 24px max)</p>
              <h1
                className="font-bold"
                style={{
                  fontSize: '1.5rem',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-serif)'
                }}
              >
                The Journal - Stories and Reflections
              </h1>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>HEADING 2 (SERIF, MEDIUM, 16px max)</p>
              <h2
                className="font-medium"
                style={{
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-serif)'
                }}
              >
                Special Section Heading
              </h2>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>HEADING 3 (SANS-SERIF, SEMIBOLD, 16px)</p>
              <h3
                className="font-semibold"
                style={{
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                Article Title or Card Heading
              </h3>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>BODY TEXT (SANS-SERIF, REGULAR, 15px, 1.6 LINE HEIGHT)</p>
              <p
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                Body text should be warm, readable, and comfortable. Use generous line-height (1.6) for a relaxed reading experience. This is the primary text for articles, descriptions, and content.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>SMALL TEXT (SANS-SERIF, REGULAR, 14px)</p>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                Small text for meta information, captions, and supplementary content
              </p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <div>
            <h2
              className="font-semibold mb-2"
              style={{
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-serif)'
              }}
            >
              Buttons
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Three button variants for different contexts and hierarchy
            </p>
          </div>

          <div className="rounded-xl p-8 space-y-8" style={{ background: 'white', border: '1px solid var(--border-soft)' }}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-tertiary)' }}>PRIMARY - Sunflower Gold background, Soil Brown text</p>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Primary Action
                  </button>
                  <button className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                    Small Primary
                  </button>
                  <button className="btn-primary" disabled>
                    Disabled Primary
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-tertiary)' }}>SECONDARY - Sage Green background, Secondary text</p>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-secondary">
                    <Heart className="w-4 h-4 inline mr-2" />
                    Secondary Action
                  </button>
                  <button className="btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                    Small Secondary
                  </button>
                  <button className="btn-secondary" disabled>
                    Disabled Secondary
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-tertiary)' }}>TERTIARY - Transparent with Soil Brown border</p>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-tertiary">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Tertiary Action
                  </button>
                  <button className="btn-tertiary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                    Small Tertiary
                  </button>
                  <button className="btn-tertiary" disabled>
                    Disabled Tertiary
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4" style={{ borderTop: '1px solid var(--border-soft)' }}>
              <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                <strong>Usage Guidelines:</strong> Primary for main actions (save, submit, create), Secondary for supporting actions (edit, filter), Tertiary for low-emphasis actions (cancel, dismiss)
              </p>
            </div>
          </div>
        </section>

        {/* Cards & Containers */}
        <section className="space-y-6">
          <div>
            <h2
              className="font-semibold mb-2"
              style={{
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-serif)'
              }}
            >
              Cards & Containers
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Rounded corners (12-16px), soft shadows, generous spacing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div
              className="rounded-xl p-6 space-y-3"
              style={{
                background: 'white',
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-soft)'
              }}
            >
              <h3 className="font-semibold" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                Standard Card
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                White background, soft border, gentle shadow. Use for articles, entries, and content blocks.
              </p>
              <div className="pt-2">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'var(--rose-beige)', color: 'var(--text-primary)' }}
                >
                  #example-tag
                </span>
              </div>
            </div>

            <div
              className="rounded-xl p-6 space-y-3"
              style={{
                background: 'linear-gradient(135deg, var(--lavender-dust) 0%, white 100%)',
                border: '1px solid var(--border-soft)',
                boxShadow: 'var(--shadow-medium)'
              }}
            >
              <h3 className="font-semibold" style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                Special Card
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Lavender gradient background for AI insights, special features, or highlighted content.
              </p>
              <div className="pt-2">
                <Sparkles className="w-4 h-4 inline" style={{ color: 'var(--sunflower-gold)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Tags & Pills */}
        <section className="space-y-6">
          <div>
            <h2
              className="font-semibold mb-2"
              style={{
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-serif)'
              }}
            >
              Tags & Pills
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Pill-shaped tags with warm background colors
            </p>
          </div>

          <div className="rounded-xl p-8 space-y-4" style={{ background: 'white', border: '1px solid var(--border-soft)' }}>
            <div className="flex flex-wrap gap-2">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ background: 'var(--rose-beige)', color: 'var(--text-primary)' }}
              >
                #mindfulness
              </span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ background: 'var(--lavender-dust)', color: 'var(--text-primary)' }}
              >
                #reflection
              </span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ background: 'var(--sage-green)', color: 'var(--text-secondary)' }}
              >
                #wellness
              </span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ background: 'var(--sunflower-gold)', color: 'var(--deep-soil)' }}
              >
                #featured
              </span>
            </div>
            <p className="text-xs pt-2" style={{ color: 'var(--text-tertiary)' }}>
              Use rose-beige for general tags, lavender for special categories, sage for inactive states, and gold for active/featured
            </p>
          </div>
        </section>

        {/* Spacing Scale */}
        <section className="space-y-6">
          <div>
            <h2
              className="font-semibold mb-2"
              style={{
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-serif)'
              }}
            >
              Spacing Scale
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Generous, breathable spacing for a calm, premium feel
            </p>
          </div>

          <div className="rounded-xl p-8 space-y-4" style={{ background: 'white', border: '1px solid var(--border-soft)' }}>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>8px</div>
                <div className="h-2 rounded" style={{ width: '8px', background: 'var(--sunflower-gold)' }}></div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Tight spacing</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>12px</div>
                <div className="h-2 rounded" style={{ width: '12px', background: 'var(--sunflower-gold)' }}></div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Compact spacing</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>16px</div>
                <div className="h-2 rounded" style={{ width: '16px', background: 'var(--sunflower-gold)' }}></div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Default spacing</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>24px</div>
                <div className="h-2 rounded" style={{ width: '24px', background: 'var(--sunflower-gold)' }}></div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Comfortable spacing</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>32px</div>
                <div className="h-2 rounded" style={{ width: '32px', background: 'var(--sunflower-gold)' }}></div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Generous spacing</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>48px</div>
                <div className="h-2 rounded" style={{ width: '48px', background: 'var(--sunflower-gold)' }}></div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Section spacing</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8" style={{ borderTop: '1px solid var(--border-soft)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            The Sunflower Post Design System • Warm, Welcoming, Grounded
          </p>
        </footer>
      </div>
    </div>
  );
}
