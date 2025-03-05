module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      animation: {
        background: 'background 2s ease-in-out infinite',
        linear: 'backgroundLinear 3s linear infinite',
        slide: 'backgroundSlide 120s linear infinite alternate-reverse forwards;',
      },
      keyframes: {
        background: {
          '0%, 100%': { backgroundPosition: 'left 0% bottom 0%' },
          '50%': { backgroundPosition: 'left 200% bottom 0%' },
        },
        backgroundLinear: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        backgroundSlide: {
          '0%': { backgroundPosition: '0 0%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}