/** @type {import('tailwindcss').Config} */
module.exports = {
    // 定义要处理的文件
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    // 深色模式配置
    darkMode: 'class', // 'media' 或 'class'
    theme: {
      // 扩展现有主题
      extend: {
        // 自定义颜色
        colors: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49',
          },
          secondary: {
            // 可以添加其他颜色
          },
        },
        // 自定义字体
        fontFamily: {
          sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
          serif: ['var(--font-serif)', 'Georgia', 'serif'],
          mono: ['var(--font-mono)', 'monospace'],
        },
        // 自定义间距
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
        // 自定义断点
        screens: {
          'xs': '475px',
          // 其他断点会继承默认值
        },
        // 自定义容器
        container: {
          center: true,
          padding: {
            DEFAULT: '1rem',
            sm: '2rem',
            lg: '4rem',
            xl: '5rem',
            '2xl': '6rem',
          },
        },
        // 自定义动画
        animation: {
          'spin-slow': 'spin 3s linear infinite',
          'bounce-slow': 'bounce 3s infinite',
        },
        // 自定义过渡时间
        transitionDuration: {
          '2000': '2000ms',
          '3000': '3000ms',
        },
        // 自定义阴影
        boxShadow: {
          'custom': '0 0 10px rgba(0, 0, 0, 0.1)',
        },
        // 自定义边框圆角
        borderRadius: {
          '4xl': '2rem',
        },
      },
    },
    // 插件配置
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
      require('@tailwindcss/line-clamp'),
    ],
    // 变体配置
    variants: {
      extend: {
        opacity: ['disabled'],
        cursor: ['disabled'],
        backgroundColor: ['active', 'disabled'],
        textColor: ['active', 'disabled'],
      },
    },
  }