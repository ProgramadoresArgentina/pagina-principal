'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

export default function ImageModal({ isOpen, onClose, imageSrc, imageAlt }: ImageModalProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Asegurar que el componente esté montado en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);
  // Resetear estados cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [isOpen, imageSrc]);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div 
      className="image-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px',
        cursor: 'pointer'
      }}
    >
      <div 
        className="image-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'fixed',
            top: '30px',
            right: '30px',
            background: 'rgba(0, 0, 0, 0.8)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            fontSize: '24px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            zIndex: 1000000,
            fontWeight: 'bold',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>

        {/* Indicador de carga */}
        {imageLoading && !imageError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              color: 'white',
              fontSize: '18px'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid rgba(255,255,255,0.3)',
                borderTop: '3px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
              }}></div>
              Cargando imagen...
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {imageError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              color: 'white',
              fontSize: '18px',
              textAlign: 'center',
              padding: '20px'
            }}
          >
            <div>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
              <div>No se pudo cargar la imagen</div>
              <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '10px' }}>
                URL: {imageSrc}
              </div>
            </div>
          </div>
        )}

        {/* Imagen */}
        {!imageError && (
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{
              maxWidth: 'calc(100vw - 80px)',
              maxHeight: 'calc(100vh - 80px)',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              display: imageLoading ? 'none' : 'block'
            }}
            onLoad={() => {
              console.log('✅ Imagen cargada correctamente:', imageSrc);
              setImageLoading(false);
            }}
            onError={(e) => {
              console.error('❌ Error cargando imagen:', imageSrc);
              console.error('Error details:', e);
              setImageLoading(false);
              setImageError(true);
            }}
          />
        )}

        {/* Texto de ayuda */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '8px 16px',
            borderRadius: '20px'
          }}
        >
          Presiona ESC o haz click fuera para cerrar
        </div>
      </div>
    </div>
  );

  // Renderizar el modal usando un portal directamente en el body
  return createPortal(modalContent, document.body);
}
