import type { AccommodationCardModel } from '../features/marketplace/types/accommodation.types';

export type SearchAccommodationsData = {
  searchAccommodations: {
    items: Array<{
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
    }>;
    pagina: number;
    limite: number;
    totalResultados: number;
    totalPaginas: number;
    tieneSiguiente: boolean;
    tieneAnterior: boolean;
  };
};

export type AccommodationDetailData = {
  accommodation: {
    sucursalGuid: string;
    nombre: string;
    ciudad?: string | null;
    provincia?: string | null;
    pais?: string | null;
    direccion?: string | null;
    descripcion?: string | null;
    descripcionCompleta?: string | null;
    precioDesde?: number | null;
    moneda?: string | null;
    imagenPrincipalUrl?: string | null;
    imagenes?: string[] | null;
    amenities?: string[] | null;
    promedioValoracion?: number | null;
    totalValoraciones?: number | null;
    habitacionesDisponibles?: number | null;
    serviciosDestacados?: string[] | null;
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
};

export type AccommodationReviewsData = {
  accommodationReviews: {
    items: Array<{
      valoracionGuid: string;
      puntuacion: number;
      comentarioPositivo?: string | null;
      comentarioNegativo?: string | null;
      tipoViaje?: string | null;
      fecha: string;
      nombreVisibleCliente: string;
      respuestaPropiedad?: string | null;
    }>;
    pagina: number;
    limite: number;
    totalResultados: number;
    totalPaginas: number;
    tieneSiguiente: boolean;
    tieneAnterior: boolean;
  };
};

export type CreateReservationData = {
  createReservation: {
    success: boolean;
    message?: string | null;
    correlationId?: string | null;
    errors?: Array<{ code?: string; message?: string; httpStatus?: number; service?: string }>;
    data?: {
      reservaGuid: string;
      codigoReserva: string;
      sucursalGuid: string;
      fechaInicio: string;
      fechaFin: string;
      subtotalReserva: number;
      valorIva: number;
      totalReserva: number;
      saldoPendiente: number;
      estadoReserva: string;
      observaciones?: string | null;
      habitaciones?: Array<{
        reservaHabitacionGuid: string;
        numAdultos: number;
        numNinos: number;
        precioNocheAplicado: number;
        totalLinea: number;
        estadoDetalle: string;
      }> | null;
    } | null;
  };
};

export type ReservationData = {
  reservation: {
    reservaGuid: string;
    codigoReserva: string;
    sucursalGuid: string;
    fechaInicio: string;
    fechaFin: string;
    subtotalReserva: number;
    valorIva: number;
    totalReserva: number;
    saldoPendiente: number;
    estadoReserva: string;
    observaciones?: string | null;
    habitaciones?: Array<{
      reservaHabitacionGuid: string;
      numAdultos: number;
      numNinos: number;
      precioNocheAplicado: number;
      totalLinea: number;
      estadoDetalle: string;
    }> | null;
  };
};

export type MyReservationsData = {
  myReservations: {
    items: ReservationData['reservation'][];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
};

export type CancelReservationData = {
  cancelReservation: {
    success: boolean;
    message?: string | null;
    errors?: Array<{ message?: string }>;
  };
};

// re-export for convenience
export type { AccommodationCardModel };
