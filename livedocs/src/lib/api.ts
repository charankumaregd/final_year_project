export async function api(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (response.status === 401) {
      const refreshSuccess = await attemptTokenRefresh();
      if (refreshSuccess) {
        const retryResponse = await fetch(url, {
          ...options,
          credentials: "include",
        });

        if (!retryResponse.ok) {
          const errorData = await retryResponse.json();
          throw new Error(
            errorData.error || "Failed to fetch data after refresh"
          );
        }

        return retryResponse;
      } else {
        redirectToLogin();
        throw new Error("Session expired. Please log in again.");
      }
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "An error occurred while fetching data"
      );
    }

    return response;
  } catch (error) {
    console.error("API error:", error);
    return Promise.reject(error);
  }
}

async function attemptTokenRefresh(): Promise<boolean> {
  try {
    const response = await fetch("/api/refresh", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Failed to refresh token");
      return false;
    }

    await response.json();
    console.log("Token refreshed successfully");
    return true;
  } catch (error) {
    console.error("Error during token refresh:", error);
    return false;
  }
}

function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    const redirectUrl = window.location.pathname;
    window.location.href = `/login?redirectUrl=${encodeURIComponent(
      redirectUrl
    )}`;
  }
}
