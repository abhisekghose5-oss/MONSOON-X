export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface KoraputBlockInfo {
  id: string;
  name: string;
  headquarters: string;
  coordinates: GeoCoordinates;
  elevationMeters: number;
  agroEcologicalZone: string;
  totalAreaSqKm: number;
}

export type KoraputBlockId =
  | 'koraput'
  | 'jeypore'
  | 'semiliguda'
  | 'pottangi'
  | 'nandapur'
  | 'lamtaput'
  | 'dasamantapur'
  | 'laxmipur'
  | 'narayanpatna'
  | 'bandhugaon'
  | 'borigumma'
  | 'kotpad'
  | 'kundura'
  | 'boipariguda';
