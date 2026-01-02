module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './content/**/*.{md,mdx}',
    ],
    theme: {
        screens: {
            xsm: '340px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                'autumn-orange': '#f5800b',
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.slate.300'),
                        a: {
                            color: theme('colors.slate.200'),
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px',
                            textDecorationColor: theme('colors.slate.500'),
                            '&:hover': {
                                color: theme('colors.white'),
                                textDecorationColor: theme('colors.slate.200'),
                            },
                        },
                        hr: {
                            borderColor: theme('colors.slate.700'),
                        },
                        strong: {
                            color: theme('colors.white'),
                        },
                        code: {
                            color: theme('colors.slate.200'),
                            backgroundColor: theme('colors.slate.800'),
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                        },
                        'code::before': { content: '""' },
                        'code::after': { content: '""' },
                        pre: {
                            backgroundColor: theme('colors.slate.800'),
                            borderColor: theme('colors.slate.700'),
                            borderWidth: '1px',
                        },
                        blockquote: {
                            color: theme('colors.slate.300'),
                            borderLeftColor: theme('colors.autumn-orange'),
                        },
                        'h1, h2, h3, h4, h5, h6': {
                            color: theme('colors.white'),
                        },
                        figcaption: {
                            color: theme('colors.slate.400'),
                        },
                        'ul > li::marker': {
                            color: theme('colors.slate.500'),
                        },
                        'ol > li::marker': {
                            color: theme('colors.slate.500'),
                        },
                    },
                },
            }),
            transitionDuration: {
                0: '0ms',
                2000: '2000ms',
                4000: '4000ms',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
};