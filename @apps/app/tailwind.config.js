import daisyui from "daisyui";
import typography from "@tailwindcss/typography";
import { remToPx } from "./script/remToPx";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./sidepanel.html", "./src/**/*.{js,ts,jsx,tsx}"],
  root: 10,
  // safelist: process.env.NODE_ENV === 'development' ? [{ pattern: /./ }] : [],
  // eslint-disable-next-line no-undef
  safelist:
    process.env.NODE_ENV === "development" ? [{ pattern: /btn-+/ }] : [],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
    fontSize: {
      'base': '14px', // 10px
      'xs': '10px', //12px
      'sm': '12px', //12px
      'lg': '16px', //12px
      'xl': '18px', //14px
      '2xl': '20px', //16px
    },
    spacing: {
      base: "14px", // 10px
      xs: "10px", //12px
      sm: "12px", //12px
      lg: "16px", //12px
      xl: "18px", //14px
      "2xl": "20px", //16px
      px: '1px',
      0: '0',
      0.5: remToPx(0.125),
      1: remToPx(0.25),
      1.5:remToPx(0.375),
      2: remToPx(0.5),
      2.5:remToPx(0.625),
      3: remToPx(0.75),
      3.5:remToPx(0.875),
      4: remToPx(1),
      5: remToPx(1.25),
      6: remToPx(1.5),
      7: remToPx(1.75),
      8: remToPx(2),
      9: remToPx(2.25),
      10: remToPx(2.5),
      11: remToPx(2.75),
      12: remToPx(3),
      14: remToPx(3.5),
      16: remToPx(4),
      20: remToPx(5),
      24: remToPx(6),
      28: remToPx(7),
      32: remToPx(8),
      36: remToPx(9),
      40: remToPx(10),
      44: remToPx(11),
      48: remToPx(12),
      52: remToPx(13),
      56: remToPx(14),
      60: remToPx(15),
      64: remToPx(16),
      72: remToPx(18),
      80: remToPx(20),
      96: remToPx(24),
    },
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  atDirectives: [
    {
      name: "@tailwind",
      description:
        "Use the `@tailwind` directive to insert Tailwind's `base`, `components`, `utilities` and `screens` styles into your CSS.",
      references: [
        {
          name: "Tailwind Documentation",
          url: "https://tailwindcss.com/docs/functions-and-directives#tailwind",
        },
      ],
    },
    {
      name: "@apply",
      description:
        "Use the `@apply` directive to inline any existing utility classes into your own custom CSS. This is useful when you find a common utility pattern in your HTML that you’d like to extract to a new component.",
      references: [
        {
          name: "Tailwind Documentation",
          url: "https://tailwindcss.com/docs/functions-and-directives#apply",
        },
      ],
    },
    {
      name: "@responsive",
      description:
        "You can generate responsive variants of your own classes by wrapping their definitions in the `@responsive` directive:\n```css\n@responsive {\n  .alert {\n    background-color: #E53E3E;\n  }\n}\n```\n",
      references: [
        {
          name: "Tailwind Documentation",
          url: "https://tailwindcss.com/docs/functions-and-directives#responsive",
        },
      ],
    },
    {
      name: "@screen",
      description:
        "The `@screen` directive allows you to create media queries that reference your breakpoints by **name** instead of duplicating their values in your own CSS:\n```css\n@screen sm {\n  /* ... */\n}\n```\n…gets transformed into this:\n```css\n@media (min-width: 640px) {\n  /* ... */\n}\n```\n",
      references: [
        {
          name: "Tailwind Documentation",
          url: "https://tailwindcss.com/docs/functions-and-directives#screen",
        },
      ],
    },
    {
      name: "@variants",
      description:
        "Generate `hover`, `focus`, `active` and other **variants** of your own utilities by wrapping their definitions in the `@variants` directive:\n```css\n@variants hover, focus {\n   .btn-brand {\n    background-color: #3182CE;\n  }\n}\n```\n",
      references: [
        {
          name: "Tailwind Documentation",
          url: "https://tailwindcss.com/docs/functions-and-directives#variants",
        },
      ],
    },
  ],
};
