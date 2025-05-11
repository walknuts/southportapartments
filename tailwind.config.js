module.exports = {
  content: [
    "./src/**/*.{njk,md,html,js}",
    "./src/_includes/**/*.{njk,md,html,js}",
    "./src/_layouts/**/*.{njk,md,html,js}"
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      colors: {
        'primary': '#696871',
        'primary-focus': '#424ff8',
        'primary-content': '#fdfcf9',
        'secondary': '#702bf7',
        'accent': '#2b3af7',
        'neutral': '#0d042b',
        'base-100': '#ffffff',
        'base-200': '#f8f9ff',
        'base-300': '#eef2f9',
        'base-content': '#0d042b',
      },
      fontFamily: {
        'sans': ['"Source Sans 3"', 'sans-serif'],
        'heading': ['Lato', 'sans-serif'],
        'mono': ['"Source Code Pro"', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.base-content'),
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.neutral'),
              fontFamily: theme('fontFamily.heading').join(', '),
            },
            a: {
              color: theme('colors.accent'),
              '&:hover': {
                color: theme('colors.primary-focus'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        southport: {
          'primary': '#696871',
          'primary-focus': '#424ff8',
          'primary-content': '#fdfcf9',
          'secondary': '#702bf7',
          'accent': '#2b3af7',
          'neutral': '#0d042b',
          'base-100': '#ffffff',
          'base-200': '#f8f9ff',
          'base-300': '#eef2f9',
          'base-content': '#0d042b',
        },
        southportDark: {
          'primary': '#2b3af7',
          'primary-focus': '#424ff8',
          'primary-content': '#fdfcf9',
          'secondary': '#702bf7',
          'accent': '#2b3af7',
          'neutral': '#f5f5ec',
          'base-100': '#0f0f10',
          'base-200': '#1a191c',
          'base-300': '#222124',
          'base-content': '#f5f5ec',
        }
      }
    ],
    darkTheme: "southportDark",
  },
}