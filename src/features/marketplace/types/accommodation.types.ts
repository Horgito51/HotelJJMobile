export type SearchParams = {
  destino: string;
  fechaInicio: string;
  fechaFin: string;
  adultos: number;
  ninos: number;
  habitaciones: number;
  precioMin?: number;
  precioMax?: number;
  ordenarPor?: string;
};

export type AccommodationCardModel = {
  id: string;
  title: string;
  location: string;
  description?: string;
  imageUrl?: string;
  priceFrom?: number;
  currency: string;
  rating?: number;
  reviewCount: number;
  availableRooms: number;
  services: string[];
};

export type RoomTypeModel = {
  id: string;
  name: string;
  bedType?: string;
  adultCapacity: number;
  childCapacity: number;
  areaM2?: number;
  pricePerNight: number;
  availableInRange?: number;
  images: string[];
};

export type AccommodationDetailModel = AccommodationCardModel & {
  fullDescription?: string;
  images: string[];
  amenities: string[];
  roomTypes: RoomTypeModel[];
  policies?: {
    checkIn?: string;
    checkOut?: string;
    acceptsChildren: boolean;
    allowsPets: boolean;
    text?: string;
  };
};

export type ReviewModel = {
  id: string;
  score: number;
  positiveComment?: string;
  negativeComment?: string;
  tripType?: string;
  date: string;
  clientName: string;
  propertyReply?: string;
};

export type SelectedRoomSelection = {
  tipoHabitacionGuid: string;
  nombre: string;
  numHabitaciones: number;
  precioNocheAplicado: number;
  disponiblesEnRango: number;
};

export type BookingDraft = {
  sucursalGuid: string;
  nombre: string;
  moneda: string;
  imagenUrl?: string;
  search: SearchParams;
  selectedRoom: SelectedRoomSelection;
};
