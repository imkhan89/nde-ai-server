/*
NDE Automotive AI
Pagination Utilities
*/

export function paginate(items = [], page = 1, limit = 20) {

  const total = items.length;

  const p = Math.max(1, Number(page) || 1);

  const l = Math.max(1, Number(limit) || 20);

  const start = (p - 1) * l;

  const end = start + l;

  const results = items.slice(start, end);

  return {
    page: p,
    limit: l,
    total,
    totalPages: Math.ceil(total / l),
    results
  };

}

export function buildPaginationMeta(page, limit, total) {

  const p = Number(page) || 1;

  const l = Number(limit) || 20;

  return {
    page: p,
    limit: l,
    total,
    totalPages: Math.ceil(total / l)
  };

}
