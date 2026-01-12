'use client'

import { JSX, useEffect, useState } from "react";
import Header from "./Header";
import MobileHeader from "./MobileHeader";

/**
 * Componente unificado que renderiza el header correcto según el tamaño de pantalla
 * Header: Visible en xl+ (1200px+)
 * MobileHeader: Visible en menor a XL (<1200px)
 */
export default function Navigation(): JSX.Element {
  const [isXL, setIsXL] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Función para verificar el tamaño de pantalla
    const checkScreenSize = () => {
      setIsXL(window.innerWidth >= 1200);
    };

    // Verificar al montar
    checkScreenSize();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // No renderizar nada hasta que el componente esté montado en el cliente
  if (!mounted) {
    return <></>;
  }

  return isXL ? <Header /> : <MobileHeader />;
}
