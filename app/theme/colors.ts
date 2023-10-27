const palette = {
  neutral100: "#CBE2D3",
  neutral200: "#BEDAC8",
  neutral300: "#B1D3BD",
  neutral400: "#A4CCB2",
  neutral500: "#97C4A7",
  neutral600: "#89BD9B",
  neutral700: "#7CB690",
  neutral800: "#6FAE85",
  neutral900: "#62A77A",

  primary100: "#557854",
  primary200: "#4D6C4B",
  primary300: "#446043",
  primary400: "#3C543B",
  primary500: "#334832",
  primary600: "#2B3C2A",

  secondary100: "#3C87CD",
  secondary200: "#327DC3",
  secondary300: "#2E72B2",
  secondary400: "#2A68A2",
  secondary500: "#235789",

  accent100: "#DBDFA5",
  accent200: "#D5D996",
  accent300: "#CFD487",
  accent400: "#C9CE78",
  accent500: "#C2C968",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

// const palette = {
//   neutral100: "#6AAB81",

//   primary100: "#2B3C2A",


//   secondary100: "#235789",
//   secondary200: "#24A6A7",


//   accent100: "#C2C968",


//   overlay20: "rgba(25, 16, 21, 0.2)",
//   overlay50: "rgba(25, 16, 21, 0.5)",
// } as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  // text: palette.neutral800,
  text: palette.primary500,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
}
