const normalizeRouteValue = (value) => String(value ?? "").trim();

const buildRouteQuery = (route) => {
  if (!route || typeof route !== "object" || Array.isArray(route)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(route).flatMap(([key, value]) => {
      if (value === null || value === undefined) return [];
      if (typeof value === "string" && value.trim() === "") return [];

      return [[key, typeof value === "string" ? value.trim() : value]];
    })
  );
};

const buildListingQuery = (item) => {
  const routeQuery = buildRouteQuery(item?.route);
  if (Object.keys(routeQuery).length) {
    return routeQuery;
  }

  const category = normalizeRouteValue(item?.category);
  const child = normalizeRouteValue(item?.child);

  if (!category && !child) {
    return {};
  }

  const query = {};

  if (category) query.category = category;
  if (child) query.child = child;

  return query;
};

export const resolveProductListingTo = (item) => {
  if (!item) return "/products/";

  const query = buildListingQuery(item);
  if (Object.keys(query).length) {
    return {
      path: "/products/",
      query,
    };
  }

  const productUrl =
    item?.type === "product" ? normalizeRouteValue(item?.url) : "";
  if (productUrl) {
    return productUrl;
  }

  const productSlug =
    item?.type === "product" ? normalizeRouteValue(item?.slug) : "";
  if (productSlug) {
    return `/products/${productSlug}`;
  }

  if (item.url) return item.url;

  return "/products/";
};
