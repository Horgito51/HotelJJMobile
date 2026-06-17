import { gql } from '@apollo/client';

export const RESERVATION_QUERY = gql`
  query Reservation($reservaGuid: UUID!) {
    reservation(reservaGuid: $reservaGuid) {
      reservaGuid
      codigoReserva
      clienteGuid
      sucursalGuid
      fechaReservaUtc
      fechaInicio
      fechaFin
      subtotalReserva
      valorIva
      totalReserva
      descuentoAplicado
      saldoPendiente
      origenCanalReserva
      estadoReserva
      observaciones
      esWalkin
      habitaciones {
        reservaHabitacionGuid
        habitacionGuid
        fechaInicio
        fechaFin
        numAdultos
        numNinos
        precioNocheAplicado
        subtotalLinea
        valorIvaLinea
        descuentoLinea
        totalLinea
        estadoDetalle
      }
    }
  }
`;

export const MY_RESERVATIONS = gql`
  query MyReservations($input: MyReservationsInput) {
    myReservations(input: $input) {
      items {
        reservaGuid
        codigoReserva
        clienteGuid
        sucursalGuid
        fechaReservaUtc
        fechaInicio
        fechaFin
        subtotalReserva
        valorIva
        totalReserva
        descuentoAplicado
        saldoPendiente
        origenCanalReserva
        estadoReserva
        observaciones
        esWalkin
        habitaciones {
          reservaHabitacionGuid
          habitacionGuid
          fechaInicio
          fechaFin
          numAdultos
          numNinos
          precioNocheAplicado
          subtotalLinea
          valorIvaLinea
          descuentoLinea
          totalLinea
          estadoDetalle
        }
      }
      totalCount
      pageNumber
      pageSize
    }
  }
`;
