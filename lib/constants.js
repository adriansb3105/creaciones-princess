// Datos de negocio centralizados. Cambia aquí los números de contacto,
// el porcentaje de adelanto, etc. — no hace falta tocar ningún otro archivo.

export const BUSINESS_NAME = 'Creaciones Princess';
export const BUSINESS_TAGLINE = 'Endulzamos tus momentos con amor';
export const BUSINESS_EMAIL = 'hola@creacionesprincess.com';
export const BUSINESS_HOURS = 'Lun - Sáb: 9:00 AM - 6:00 PM';
export const BUSINESS_LOCATION_NOTE = 'Sin local físico — entregas y coordinación por WhatsApp';

// Números de WhatsApp para pedidos (Costa Rica). El primario también recibe Sinpe Móvil.
export const WHATSAPP_PRIMARY_DISPLAY = '+506 8782 5868';
export const WHATSAPP_PRIMARY_WA = '50687825868';
export const WHATSAPP_SECONDARY_DISPLAY = '+506 8704 3365';
export const WHATSAPP_SECONDARY_WA = '50687043365';

export const SINPE_PHONE_DISPLAY = '+506 8782 5868';

// Porcentaje de adelanto requerido para confirmar un pedido (50%).
export const DEPOSIT_PERCENTAGE = 0.5;

export const CURRENCY_CODE = 'CRC';
export const CURRENCY_LOCALE = 'es-CR';

export function buildWhatsAppLink(phoneWa, message) {
  return `https://wa.me/${phoneWa}?text=${encodeURIComponent(message)}`;
}
