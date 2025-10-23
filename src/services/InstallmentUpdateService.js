// 👉 Update with your backend base URL
import { API_BASE_URL_OLD } from "../Config/API";

export const insertSchemeCollection = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL_OLD}/account/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if response is OK (status 200–299)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Server Error:", errorText);
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    // Try parsing JSON (if backend returns text, handle that too)
    const contentType = response.headers.get("content-type");
    const result =
      contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    console.log("✅ Insert Success:", result);
    return result;
  } catch (error) {
    console.error("❌ Error inserting scheme collection:", error);
    throw error;
  }
};
