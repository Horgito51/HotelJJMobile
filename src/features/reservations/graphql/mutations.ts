import { gql } from '@apollo/client';

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      success
      message
      correlationId
      errors {
        code
        message
        httpStatus
        service
      }
      data {
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
  }
`;

export const CANCEL_RESERVATION = gql`
  mutation CancelReservation($input: CancelReservationInput!) {
    cancelReservation(input: $input) {
      success
      message
      correlationId
      errors {
        code
        message
        httpStatus
        service
      }
    }
  }
`;
