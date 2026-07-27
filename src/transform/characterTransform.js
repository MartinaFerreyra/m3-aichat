export function toCharacterProfile(raw) {
  return {
    id:           raw?.id             ?? null,
    name:         raw?.name           ?? "Desconocido",
    image:        raw?.image          ?? "",
    status:       raw?.status         ?? "Unknown",
    species:      raw?.species        ?? "Unknown",
    originName:   raw?.origin?.name   ?? "Unknown",
    locationName: raw?.location?.name ?? "Unknown",
  };
}
//funcion que aplica todo lo que vimos, 