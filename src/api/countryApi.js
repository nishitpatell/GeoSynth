const BASE_URL = "https://restcountries.com/v3.1/name";

export async function fetchCountryByName(name) {
  try {
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(name)}?fullText=true`
    );
    if (!response.ok) throw new Error("Country not found");
    const data = await response.json();
    return data[0]; // The API returns an array, take the first match
  } catch (error) {
    console.error("Error fetching country data:", error);
    return null;
  }
}
