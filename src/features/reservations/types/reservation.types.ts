export type ReservationModel = {
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
  observaciones?: string;
  habitaciones: Array<{
    reservaHabitacionGuid: string;
    numAdultos: number;
    numNinos: number;
    precioNocheAplicado: number;
    totalLinea: number;
    estadoDetalle: string;
  }>;
};

export type ClientFormValues = {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
};

export type PaymentFormValues = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  securityCode: string;
};

export const emptyClientForm: ClientFormValues = {
  tipoIdentificacion: 'CED',
  numeroIdentificacion: '',
  nombres: '',
  apellidos: '',
  correo: '',
  telefono: '',
  direccion: '',
};

export const emptyPaymentForm: PaymentFormValues = {
  cardholderName: '',
  cardNumber: '',
  expiry: '',
  securityCode: '',
};
