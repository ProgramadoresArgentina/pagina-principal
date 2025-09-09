'use client';

import { useEffect } from 'react';

export default function SubscriptionHandler() {
  useEffect(() => {
    // Solo ejecutar en el cliente después de la hidratación
    const handleSubscriptionSuccess = () => {
      // Verificar si hay parámetros de éxito en la URL
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const status = urlParams.get('status');
      
      // Mostrar mensaje de confirmación si la suscripción fue exitosa
      if (success === 'true' || status === 'approved') {
        const confirmationDiv = document.querySelector('.subscription-confirmation');
        if (confirmationDiv) {
          confirmationDiv.style.display = 'block';
          confirmationDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Limpiar la URL para que no se muestre el mensaje en recargas
          const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      }
    };

    // Ejecutar después de un pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(handleSubscriptionSuccess, 100);

    // También escuchar eventos de MercadoPago si están disponibles
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'mp_subscription_success') {
        const confirmationDiv = document.querySelector('.subscription-confirmation');
        if (confirmationDiv) {
          confirmationDiv.style.display = 'block';
          confirmationDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return null; // Este componente no renderiza nada
}
