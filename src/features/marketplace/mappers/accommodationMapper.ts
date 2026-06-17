import type {
  AccommodationCardModel,
  AccommodationDetailModel,
  ReviewModel,
  RoomTypeModel,
} from '../types/accommodation.types';

type SearchItem = {
  sucursalGuid: string;
  nombre: string;
  ciudad?: string | null;
  provincia?: string | null;
  pais?: string | null;
  direccion?: string | null;
  descripcion?: string | null;
  precioDesde?: number | null;
  moneda?: string | null;
  imagenPrincipalUrl?: string | null;
  promedioValoracion?: number | null;
  totalValoraciones?: number | null;
  habitacionesDisponibles?: number | null;
  serviciosDestacados?: string[] | null;
};

type DetailItem = SearchItem & {
  descripcionCompleta?: string | null;
  imagenes?: string[] | null;
  amenities?: string[] | null;
  politicas?: {
    horaCheckIn?: string | null;
    horaCheckOut?: string | null;
    aceptaNinos?: boolean | null;
    permiteMascotas?: boolean | null;
    politicas?: string | null;
  } | null;
  tiposHabitacion?: Array<{
    tipoHabitacionGuid: string;
    nombre: string;
    tipoCama?: string | null;
    capacidadAdultos?: number | null;
    capacidadNinos?: number | null;
    areaM2?: number | null;
    precioNocheAplicado?: number | null;
    disponiblesEnRango?: number | null;
    imagenes?: string[] | null;
  }> | null;
};

type ReviewItem = {
  valoracionGuid: string;
  puntuacion: number;
  comentarioPositivo?: string | null;
  comentarioNegativo?: string | null;
  tipoViaje?: string | null;
  fecha: string;
  nombreVisibleCliente: string;
  respuestaPropiedad?: string | null;
};

function buildLocation(item: SearchItem): string {
  return [item.ciudad, item.provincia, item.pais].filter(Boolean).join(', ') || 'Ecuador';
}

export function mapSearchItemToCard(item: SearchItem): AccommodationCardModel {
  return {
    id: item.sucursalGuid,
    title: item.nombre,
    location: buildLocation(item),
    description: item.descripcion ?? undefined,
    imageUrl: item.imagenPrincipalUrl ?? undefined,
    priceFrom: item.precioDesde ?? undefined,
    currency: item.moneda ?? 'USD',
    rating: item.promedioValoracion ?? undefined,
    reviewCount: item.totalValoraciones ?? 0,
    availableRooms: item.habitacionesDisponibles ?? 0,
    services: item.serviciosDestacados ?? [],
  };
}

function mapRoomType(room: NonNullable<DetailItem['tiposHabitacion']>[number]): RoomTypeModel {
  return {
    id: room.tipoHabitacionGuid,
    name: room.nombre,
    bedType: room.tipoCama ?? undefined,
    adultCapacity: room.capacidadAdultos ?? 1,
    childCapacity: room.capacidadNinos ?? 0,
    areaM2: room.areaM2 ?? undefined,
    pricePerNight: room.precioNocheAplicado ?? 0,
    availableInRange: room.disponiblesEnRango ?? undefined,
    images: room.imagenes ?? [],
  };
}

export function mapDetailToModel(item: DetailItem): AccommodationDetailModel {
  const base = mapSearchItemToCard(item);
  return {
    ...base,
    fullDescription: item.descripcionCompleta ?? item.descripcion ?? undefined,
    images: item.imagenes?.length ? item.imagenes : base.imageUrl ? [base.imageUrl] : [],
    amenities: item.amenities ?? [],
    roomTypes: (item.tiposHabitacion ?? []).map(mapRoomType),
    policies: item.politicas
      ? {
          checkIn: item.politicas.horaCheckIn ?? undefined,
          checkOut: item.politicas.horaCheckOut ?? undefined,
          acceptsChildren: item.politicas.aceptaNinos ?? false,
          allowsPets: item.politicas.permiteMascotas ?? false,
          text: item.politicas.politicas ?? undefined,
        }
      : undefined,
  };
}

export function mapReview(item: ReviewItem): ReviewModel {
  return {
    id: item.valoracionGuid,
    score: item.puntuacion,
    positiveComment: item.comentarioPositivo ?? undefined,
    negativeComment: item.comentarioNegativo ?? undefined,
    tripType: item.tipoViaje ?? undefined,
    date: item.fecha,
    clientName: item.nombreVisibleCliente,
    propertyReply: item.respuestaPropiedad ?? undefined,
  };
}
