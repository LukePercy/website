module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    typography: (theme) => ({
      default: {
          css: {
            color: theme('colors.gray.900'),
            a: {
                  color: theme('colors.blue.700'),
                  '&:hover': {
                      color: theme('colors.blue.700'),
                  },
            },
            hr: {
                borderColor: theme('colors.green.500'),
            },
            h1: {
                color: theme('colors.gray.900'),
                fontSize: theme('fontSize.2xl'),
                fontWeight: theme('fontWeight.semibold'),
            },
            h2: {
                color: theme('colors.gray.900'),
                fontSize: theme('fontSize.xl'),
                fontWeight: theme('fontWeight.bold'),
            },
            h3: {
                color: theme('colors.gray.900'),
                fontSize: theme('fontSize.lg'),
                fontWeight: theme('fontWeight.semibold'),
            },
            h4: {
                color: theme('colors.gray.900'),
                fontSize: theme('fontSize.sm'),
                fontWeight: theme('fontWeight.semibold'),
            },
            h5: {
                color: theme('colors.gray.900'),
                fontSize: theme('fontSize.base'),
                fontWeight: theme('fontWeight.semibold'),
            },
            h6: {
                color: theme('colors.gray.900'),
                fontSize: theme('fontSize.base'),
                fontWeight: theme('fontWeight.semibold'),
            },
            strong: {
                color: theme('colors.gray.300'),
            },

            code: {
                color: theme('colors.gray.800'),
            },

            figcaption: {
                color: theme('colors.gray.800'),
            },
          },
      },
      dark: {
          css: {
              color: theme('colors.gray.300'),
              a: {
                  color: theme('colors.green.500'),
                  '&:hover': {
                      color: theme('colors.green.500'),
                  },
              },
              hr: {
                borderColor: theme('colors.green.500'),
              },
              h1: {
                  color: theme('colors.gray.300'),
                  fontSize: theme('fontSize.2xl'),
                  fontWeight: theme('fontWeight.semibold'),
              },
              h2: {
                  color: theme('colors.gray.300'),
                  fontSize: theme('fontSize.xl'),
                  fontWeight: theme('fontWeight.bold'),
              },
              h3: {
                  color: theme('colors.gray.300'),
                  fontSize: theme('fontSize.lg'),
                  fontWeight: theme('fontWeight.semibold'),
              },
              h4: {
                  color: theme('colors.gray.300'),
                  fontSize: theme('fontSize.sm'),
                  fontWeight: theme('fontWeight.semibold'),
              },
              h5: {
                  color: theme('colors.gray.300'),
                  fontSize: theme('fontSize.base'),
                  fontWeight: theme('fontWeight.semibold'),
              },
              h6: {
                  color: theme('colors.gray.300'),
                  fontSize: theme('fontSize.base'),
                  fontWeight: theme('fontWeight.semibold'),
              },
              strong: {
                  color: theme('colors.gray.300'),
              },

              code: {
                  color: theme('colors.gray.300'),
              },

              figcaption: {
                  color: theme('colors.gray.500'),
              },
          },
      },
  }),
    extend: {
      transitionDuration: {
        0: "0ms",
        2000: "2000ms",
        4000: "4000ms",
      },
    },
    screens: {
      'xsm': '340px',
      // => @media (min-width: 340px) { ... }

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  variants: {
    extend: {
        typography: ['dark'],
    },
    display: ["responsive", "group-hover", "group-focus"],
  },
  plugins: [require('@tailwindcss/typography')],
};