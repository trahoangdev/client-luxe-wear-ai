type EventPayload = Record<string, unknown>;

export async function trackEvent(
  name: string,
  payload: EventPayload = {},
): Promise<void> {
  // API endpoint not available, skip tracking
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("trackEvent:", name, payload);
  }
  // Silently fail - endpoint not implemented
}

export async function reportError(
  error: unknown,
  context: { component?: string; extra?: EventPayload } = {},
): Promise<void> {
  // API endpoint not available, skip error reporting
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("reportError:", error, context);
  }
  // Silently fail - endpoint not implemented
}


