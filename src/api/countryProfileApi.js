const BASE_URL = "https://restcountries.com/v3.1/name";

export async function fetchCountryProfile(name) {
  try {
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(name)}?fullText=true`
    );
    if (!response.ok) throw new Error("Country not found");
    const data = await response.json();
    return data[0]; // First country in the response array
  } catch (error) {
    console.error("Error fetching country profile:", error);
    throw error;
  }
}
