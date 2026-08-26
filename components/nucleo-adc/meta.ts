export const nucleoAdc = {
  name: "Núcleo ADC",
  fonts: {
    sans: "var(--font-geist-sans)",
    mono: "var(--font-geist-mono)",
  },
  colors: {
    navy: "#00244d",
    blue: "#2f6bff",
    background: "#eceae6",
    text: "#0e1116",
  },
} as const;

export type NucleoAdcColors = keyof typeof nucleoAdc.colors;
