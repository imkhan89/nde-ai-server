// ✅ TEMP SEARCH (NO SHOPIFY ENV REQUIRED)

export async function searchProducts(query) {
  const q = query.toLowerCase();

  const sampleProducts = [
    {
      title: "Brake Pad Mira 2017-2021",
      price: "4500",
      url: "https://ndestore.com/products/brake-pad-mira"
    },
    {
      title: "Radiator Mira 2017-2021",
      price: "8500",
      url: "https://ndestore.com/products/radiator-mira"
    },
    {
      title: "Oil Filter Mira",
      price: "1200",
      url: "https://ndestore.com/products/oil-filter-mira"
    },
    {
      title: "Air Filter Mira",
      price: "1500",
      url: "https://ndestore.com/products/air-filter-mira"
    }
  ];

  const filtered = sampleProducts.filter(p =>
    p.title.toLowerCase().includes(q)
  );

  return filtered;
}
