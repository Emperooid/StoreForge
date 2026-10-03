/**
 * Converts a blueprint's branding + theme into CSS custom properties so the
 * component library can stay fully theme-driven without any per-store code.
 */

import type { Branding, Theme } from "./blueprint/schema";

export function themeToCssVars(
  branding: Branding,
  theme: Theme,
): React.CSSProperties {
  const spacingMap = { compact: "12px", medium: "20px", large: "32px" } as const;
  const radiusMap = { none: "0px", small: "4px", medium: "10px", large: "20px" } as const;

  return {
    "--color-primary": branding.primaryColor,
    "--color-secondary": branding.secondaryColor,
    "--color-accent": branding.accentColor ?? branding.primaryColor,
    "--font-heading": theme.headingFont,
    "--font-body": theme.bodyFont,
    "--spacing": spacingMap[theme.spacing],
    "--radius": radiusMap[theme.borderRadius],
  } as React.CSSProperties;
}
