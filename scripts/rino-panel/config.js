export function resolvePageConfig(config, page) {
  const pagePath = page.path.replace(/^inserted\//, "");
  return { ...config, ...(config.pages?.[pagePath] ?? {}) };
}

