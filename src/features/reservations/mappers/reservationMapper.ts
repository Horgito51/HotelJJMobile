import type { ReservationModel } from '../types/reservation.types';

type ReservationDto = {
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

export function mapReservation(dto: ReservationDto): ReservationModel {
  return {
    reservaGuid: dto.reservaGuid,
    codigoReserva: dto.codigoReserva,
    sucursalGuid: dto.sucursalGuid,
    fechaInicio: dto.fechaInicio,
    fechaFin: dto.fechaFin,
    subtotalReserva: dto.subtotalReserva,
    valorIva: dto.valorIva,
    totalReserva: dto.totalReserva,
    saldoPendiente: dto.saldoPendiente,
    estadoReserva: dto.estadoReserva,
    observaciones: dto.observaciones ?? undefined,
    habitaciones: (dto.habitaciones ?? []).map((room) => ({
      reservaHabitacionGuid: room.reservaHabitacionGuid,
      numAdultos: room.numAdultos,
      numNinos: room.numNinos,
      precioNocheAplicado: room.precioNocheAplicado,
      totalLinea: room.totalLinea,
      estadoDetalle: room.estadoDetalle,
    })),
  };
}
