'use client'

import { JSX, useEffect, useState } from "react";
import Header from "./Header";
import MobileHeader from "./MobileHeader";

/**
 * Componente unificado que renderiza el header y el offcanvas móvil
 * Header: Siempre visible (contiene navegación desktop y botón hamburguesa para mobile)
 * MobileHeader: Siempre renderizado (contiene el panel offcanvas que se abre al hacer click)
 */
export default function Navigation(): JSX.Element {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // No renderizar nada hasta que el componente esté montado en el cliente
  if (!mounted) {
    return <></>;
  }

  return (
    <>
      <Header />
      <MobileHeader />
    </>
  );
}
