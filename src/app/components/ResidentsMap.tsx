"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

export type ResidentMapItem = {
  id: string;
  name: string;
  nationality: string;
  country: string;
  country_lat: number;
  country_lng: number;
  residency_year: number;
  profile_url?: string | null;
};

type CountryGroup = {
  country: string;
  lat: number;
  lng: number;
  residents: ResidentMapItem[];
};

export function ResidentsMap({ residents }: { residents: ResidentMapItem[] }) {
  const countries = Object.values(residents.reduce<Record<string, CountryGroup>>((groups, resident) => {
    const key = resident.country.trim().toLowerCase();
    if (!groups[key]) groups[key] = { country: resident.country, lat: resident.country_lat, lng: resident.country_lng, residents: [] };
    groups[key].residents.push(resident);
    return groups;
  }, {}));

  return (
    <div className="overflow-hidden border border-[#0051A2]/20 bg-[#d7eff5]">
      <MapContainer center={[18, -20]} zoom={2} minZoom={2} scrollWheelZoom={false} className="h-[460px] w-full md:h-[560px]">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {countries.map((country) => (
          <CircleMarker key={country.country} center={[country.lat, country.lng]} radius={Math.min(10 + country.residents.length * 2, 30)} pathOptions={{ color: "#fff", weight: 2, fillColor: "#ff466f", fillOpacity: 1 }}>
            <Popup>
              <div className="min-w-52 text-[#003d7a]">
                <strong className="text-base">{country.country}</strong>
                <p className="my-1 text-xs font-semibold">{country.residents.length} residente{country.residents.length === 1 ? "" : "s"}</p>
                <ul className="max-h-48 space-y-1 overflow-auto border-t pt-2 text-sm">
                  {country.residents.sort((a, b) => b.residency_year - a.residency_year || a.name.localeCompare(b.name)).map((resident) => <li key={resident.id}>{resident.profile_url ? <a href={resident.profile_url} target="_blank" rel="noreferrer" className="font-bold underline">{resident.name} ↗</a> : <b>{resident.name}</b>} <span className="text-xs">· {resident.nationality}, {resident.residency_year}</span></li>)}
                </ul>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <p className="border-t border-[#0051A2]/20 bg-white px-4 py-3 text-sm text-[#003d7a]"><span className="mr-2 inline-block size-3 rounded-full bg-[#ff466f]" />Países con residentes · selecciona un punto para ver el directorio.</p>
    </div>
  );
}
