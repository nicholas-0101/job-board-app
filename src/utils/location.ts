export const getUserLocation = () => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });
};

export const getCityFromCoords = async (lat: number, lng: number) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_KEY;
  const res = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
  );
  const data = await res.json();

  if (data?.results?.length > 0) {
    const components = data.results[0].components;

    const city =
      components.city ||
      components.town ||
      components.county ||
      components.state ||
      "";

    return {
      city,
      province: components.state || "",
    };
  }
  return { city: "", province: "" };
};
