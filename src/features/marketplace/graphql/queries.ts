import { gql } from '@apollo/client';

export const SEARCH_ACCOMMODATIONS = gql`
  query SearchAccommodations($input: AccommodationSearchInput) {
    searchAccommodations(input: $input) {
      items {
        sucursalGuid
        nombre
        ciudad
        provincia
        pais
        direccion
        descripcion
        precioDesde
        moneda
        imagenPrincipalUrl
        promedioValoracion
        totalValoraciones
        habitacionesDisponibles
        serviciosDestacados
        horaCheckIn
        horaCheckOut
        aceptaNinos
        permiteMascotas
      }
      pagina
      limite
      totalResultados
      totalPaginas
      tieneSiguiente
      tieneAnterior
    }
  }
`;

export const ACCOMMODATION_DETAIL = gql`
  query AccommodationDetail($sucursalGuid: UUID!, $input: AccommodationDetailInput) {
    accommodation(sucursalGuid: $sucursalGuid, input: $input) {
      sucursalGuid
      nombre
      ciudad
      provincia
      pais
      direccion
      descripcion
      descripcionCompleta
      precioDesde
      moneda
      imagenPrincipalUrl
      imagenes
      amenities
      promedioValoracion
      totalValoraciones
      habitacionesDisponibles
      serviciosDestacados
      politicas {
        horaCheckIn
        horaCheckOut
        aceptaNinos
        permiteMascotas
        politicas
      }
      tiposHabitacion {
        tipoHabitacionGuid
        nombre
        tipoCama
        capacidadAdultos
        capacidadNinos
        areaM2
        precioBase
        precioNocheAplicado
        tarifaGuid
        origenPrecio
        imagenes
        disponiblesEnRango
      }
    }
  }
`;

export const ACCOMMODATION_REVIEWS = gql`
  query AccommodationReviews($sucursalGuid: UUID!, $pagination: PaginationInput) {
    accommodationReviews(sucursalGuid: $sucursalGuid, pagination: $pagination) {
      items {
        valoracionGuid
        puntuacion
        comentarioPositivo
        comentarioNegativo
        tipoViaje
        fecha
        nombreVisibleCliente
        respuestaPropiedad
      }
      pagina
      limite
      totalResultados
      totalPaginas
      tieneSiguiente
      tieneAnterior
    }
  }
`;

export const ACCOMMODATION_AVAILABILITY = gql`
  query AccommodationAvailability(
    $sucursalGuid: UUID!
    $input: AccommodationAvailabilityInput!
  ) {
    accommodationAvailability(sucursalGuid: $sucursalGuid, input: $input) {
      sucursalGuid
      fechaInicio
      fechaFin
      totalDisponibles
      porTipoHabitacion {
        tipoHabitacionGuid
        nombre
        disponibles
        precioNocheAplicado
        tarifaGuid
        origenPrecio
      }
    }
  }
`;
