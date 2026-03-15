export function detectCustomerCountry(phone) {
  if (!phone) return "Unknown";

  if (phone.startsWith("whatsapp:")) {
    phone = phone.replace("whatsapp:", "");
  }

  if (phone.startsWith("+92")) return "Pakistan";
  if (phone.startsWith("+44")) return "United Kingdom";
  if (phone.startsWith("+1")) return "United States";
  if (phone.startsWith("+971")) return "UAE";
  if (phone.startsWith("+61")) return "Australia";
  if (phone.startsWith("+91")) return "India";

  return "International";
}
