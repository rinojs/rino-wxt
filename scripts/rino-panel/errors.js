export function isInvalidatedExtensionContext(error) {
  return String(error?.message ?? error).includes("Extension context invalidated");
}

export function reportRefreshError(error) {
  if (!isInvalidatedExtensionContext(error)) {
    console.error("Rino extension: panel state could not be refreshed.", error);
  }
}

