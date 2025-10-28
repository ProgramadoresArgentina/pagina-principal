'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import './RegisterFormStyles.css'

interface RegisterFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export default function RegisterForm({ onSuccess, redirectTo = '/' }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    username: ''
  })
  const [generatedUsername, setGeneratedUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register } = useAuth()

  // Función para limpiar texto y generar username
  const generateUsername = (name: string): string => {
    if (!name.trim()) return ''
    
    let username = name
      .toLowerCase()
      .normalize('NFD') // Descompone caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Elimina marcas diacríticas (acentos)
      .replace(/[^a-z0-9\s]/g, '') // Elimina caracteres especiales, mantiene letras, números y espacios
      .replace(/\s+/g, '') // Elimina espacios y los une
      .substring(0, 20) // Limita a 20 caracteres máximo
    
    // Si después de limpiar no queda nada válido, usar 'usuario'
    if (!username || username.length < 2) {
      username = 'usuario'
    }
    
    return username
  }

  // Función para validar el nombre
  const validateName = (name: string): boolean => {
    const trimmedName = name.trim()
    return trimmedName.length >= 2 && trimmedName.length <= 50
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Generar username automáticamente cuando cambie el nombre
    if (name === 'name') {
      const username = generateUsername(value)
      setGeneratedUsername(username)
      setFormData(prev => ({
        ...prev,
        username: username
      }))
    }
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email y contraseña son requeridos')
      return false
    }

    if (!formData.name.trim()) {
      setError('El nombre es requerido')
      return false
    }

    if (!validateName(formData.name)) {
      setError('El nombre debe tener entre 2 y 50 caracteres')
      return false
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return false
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(formData.password)) {
      setError('La contraseña debe contener al menos una mayúscula, una minúscula y un número')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return false
    }

    if (!generatedUsername) {
      setError('No se pudo generar un nombre de usuario válido')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.name || undefined,
        formData.username || undefined
      )

      if (result.success) {
        if (onSuccess) {
          onSuccess()
        } else {
          window.location.href = redirectTo
        }
      } else {
        setError(result.error || 'Error al registrarse')
      }
    } catch (error) {
      console.error('Error en registro:', error)
      setError('Error de conexión')
    }
    
    setIsLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <form onSubmit={handleSubmit} className="tp-login-input-wrapper">
      {error && (
        <div className="alert alert-danger mb-30" role="alert">
          {error}
        </div>
      )}
      
      <div className="tp-login-input-box">
        <div className="tp-login-input-title">
          <label htmlFor="email">Email *</label>
        </div>
        <div className="tp-login-input">
          <input 
            id="email" 
            name="email"
            type="email" 
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="tp-login-input-box">
        <div className="tp-login-input-title">
          <label htmlFor="name">Nombre completo *</label>
        </div>
        <div className="tp-login-input">
          <input 
            id="name" 
            name="name"
            type="text" 
            placeholder="Ej: Juan Pérez"
            value={formData.name}
            onChange={handleInputChange}
            maxLength={50}
            required
          />
        </div>
        <div className="form-help-text">
          <small>
            {formData.name.length}/50 caracteres. Se generará automáticamente tu nombre de usuario.
          </small>
        </div>
      </div>

      <div className="tp-login-input-box">
        <div className="tp-login-input-title">
          <label htmlFor="username">Nombre de usuario</label>
        </div>
        <div className="tp-login-input">
          <input 
            id="username" 
            name="username"
            type="text" 
            placeholder="Se genera automáticamente"
            value={generatedUsername}
            disabled
            className="disabled-input"
          />
        </div>
        <div className="form-help-text">
          <small>
            Generado automáticamente desde tu nombre. Ej: &quot;Juan Pérez&quot; → &quot;juanperez&quot;
          </small>
        </div>
      </div>
      
      <div className="tp-login-input-box">
        <div className="tp-login-input-title">
          <label htmlFor="password">Contraseña *</label>
        </div>
        <div className="tp-login-input p-relative">
          <input 
            id="password" 
            name="password"
            type={showPassword ? "text" : "password"} 
            placeholder="Mín. 8 caracteres, mayúscula, minúscula y número"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <div className="tp-login-input-eye" onClick={togglePasswordVisibility} style={{cursor: 'pointer'}}>
            <span className={showPassword ? "open-close" : "open-eye"}>
              {showPassword ? (
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.8822 11.7457C6.72311 11.7457 6.56402 11.6871 6.43842 11.5615C5.7518 10.8749 5.375 9.9622 5.375 8.99926C5.375 6.99803 6.99943 5.3736 9.00066 5.3736C9.9636 5.3736 10.8763 5.7504 11.5629 6.43701C11.6801 6.55424 11.7471 6.71333 11.7471 6.8808C11.7471 7.04827 11.6801 7.20736 11.5629 7.32459L7.32599 11.5615C7.20039 11.6871 7.0413 11.7457 6.8822 11.7457ZM9.00066 6.6296C7.69442 6.6296 6.631 7.69302 6.631 8.99926C6.631 9.41793 6.73986 9.81985 6.94082 10.1715L10.1729 6.93941C9.82125 6.73845 9.41933 6.6296 9.00066 6.6296Z" fill="currentcolor" />
                  <path opacity="0.5" d="M3.63816 14.4503C3.49582 14.4503 3.3451 14.4001 3.22787 14.2996C2.33192 13.5376 1.52808 12.5998 0.841463 11.5112C-0.0461127 10.1296 -0.0461127 7.87721 0.841463 6.48723C2.88456 3.28861 5.8571 1.44647 8.99711 1.44647C10.8393 1.44647 12.6563 2.08285 14.2472 3.28024C14.5235 3.48957 14.5821 3.88312 14.3728 4.15944C14.1635 4.43576 13.7699 4.49437 13.4936 4.28504C12.1204 3.24674 10.5629 2.70248 8.99711 2.70248C6.29252 2.70248 3.70515 4.32691 1.89651 7.16547C1.2685 8.14516 1.2685 9.85332 1.89651 10.833C2.52451 11.8127 3.24462 12.6584 4.04009 13.345C4.29966 13.5711 4.33315 13.9646 4.10707 14.2326C3.98984 14.3749 3.814 14.4503 3.63816 14.4503Z" fill="currentcolor" />
                  <path opacity="0.5" d="M9.00382 16.552C7.89017 16.552 6.80163 16.3259 5.75496 15.8821C5.43678 15.7482 5.28606 15.3797 5.42003 15.0616C5.554 14.7434 5.92243 14.5927 6.24062 14.7266C7.12819 15.1034 8.05764 15.296 8.99545 15.296C11.7 15.296 14.2874 13.6716 16.0961 10.833C16.7241 9.85333 16.7241 8.14517 16.0961 7.16548C15.8365 6.75519 15.5518 6.36164 15.2503 5.99321C15.0326 5.72527 15.0745 5.33172 15.3425 5.10564C15.6104 4.88793 16.0039 4.92142 16.23 5.19775C16.5566 5.59967 16.8748 6.03508 17.1595 6.48724C18.047 7.86885 18.047 10.1213 17.1595 11.5113C15.1164 14.7099 12.1438 16.552 9.00382 16.552Z" fill="currentcolor" />
                  <path d="M9.58061 12.5747C9.28754 12.5747 9.01959 12.3654 8.96098 12.0639C8.89399 11.7206 9.12007 11.3941 9.46338 11.3355C10.3845 11.168 11.1548 10.3976 11.3223 9.47657C11.3893 9.13327 11.7158 8.91556 12.0591 8.97417C12.4024 9.04116 12.6285 9.36772 12.5615 9.71103C12.2936 11.1596 11.1381 12.3068 9.69783 12.5747C9.65597 12.5663 9.62247 12.5747 9.58061 12.5747Z" fill="currentcolor" />
                  <path d="M0.625908 18.0007C0.466815 18.0007 0.307721 17.9421 0.18212 17.8165C-0.0607068 17.5736 -0.0607068 17.1717 0.18212 16.9289L6.43702 10.674C6.67984 10.4312 7.08177 10.4312 7.32459 10.674C7.56742 10.9168 7.56742 11.3188 7.32459 11.5616L1.0697 17.8165C0.944096 17.9421 0.785002 18.0007 0.625908 18.0007Z" fill="currentcolor" />
                  <path d="M11.122 7.50881C10.9629 7.50881 10.8038 7.45019 10.6782 7.32459C10.4354 7.08177 10.4354 6.67984 10.6782 6.43702L16.9331 0.182121C17.1759 -0.0607068 17.5779 -0.0607068 17.8207 0.182121C18.0635 0.424948 18.0635 0.826869 17.8207 1.0697L11.5658 7.32459C11.4402 7.45019 11.2811 7.50881 11.122 7.50881Z" fill="currentcolor" />
                </svg>
              ) : (
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6.77778C1 6.77778 3.90909 1 9 1C14.0909 1 17 6.77778 17 6.77778C17 6.77778 14.0909 12.5556 9 12.5556C3.90909 12.5556 1 6.77778 1 6.77778Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.00018 8.94466C10.2052 8.94466 11.182 7.97461 11.182 6.77799C11.182 5.58138 10.2052 4.61133 9.00018 4.61133C7.79519 4.61133 6.81836 5.58138 6.81836 6.77799C6.81836 7.97461 7.79519 8.94466 9.00018 8.94466Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="tp-login-input-box">
        <div className="tp-login-input-title">
          <label htmlFor="confirmPassword">Confirmar contraseña *</label>
        </div>
        <div className="tp-login-input p-relative">
          <input 
            id="confirmPassword" 
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"} 
            placeholder="Repetir contraseña"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <div className="tp-login-input-eye" onClick={toggleConfirmPasswordVisibility} style={{cursor: 'pointer'}}>
            <span className={showConfirmPassword ? "open-close" : "open-eye"}>
              {showConfirmPassword ? (
                <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.8822 11.7457C6.72311 11.7457 6.56402 11.6871 6.43842 11.5615C5.7518 10.8749 5.375 9.9622 5.375 8.99926C5.375 6.99803 6.99943 5.3736 9.00066 5.3736C9.9636 5.3736 10.8763 5.7504 11.5629 6.43701C11.6801 6.55424 11.7471 6.71333 11.7471 6.8808C11.7471 7.04827 11.6801 7.20736 11.5629 7.32459L7.32599 11.5615C7.20039 11.6871 7.0413 11.7457 6.8822 11.7457ZM9.00066 6.6296C7.69442 6.6296 6.631 7.69302 6.631 8.99926C6.631 9.41793 6.73986 9.81985 6.94082 10.1715L10.1729 6.93941C9.82125 6.73845 9.41933 6.6296 9.00066 6.6296Z" fill="currentcolor" />
                  <path opacity="0.5" d="M3.63816 14.4503C3.49582 14.4503 3.3451 14.4001 3.22787 14.2996C2.33192 13.5376 1.52808 12.5998 0.841463 11.5112C-0.0461127 10.1296 -0.0461127 7.87721 0.841463 6.48723C2.88456 3.28861 5.8571 1.44647 8.99711 1.44647C10.8393 1.44647 12.6563 2.08285 14.2472 3.28024C14.5235 3.48957 14.5821 3.88312 14.3728 4.15944C14.1635 4.43576 13.7699 4.49437 13.4936 4.28504C12.1204 3.24674 10.5629 2.70248 8.99711 2.70248C6.29252 2.70248 3.70515 4.32691 1.89651 7.16547C1.2685 8.14516 1.2685 9.85332 1.89651 10.833C2.52451 11.8127 3.24462 12.6584 4.04009 13.345C4.29966 13.5711 4.33315 13.9646 4.10707 14.2326C3.98984 14.3749 3.814 14.4503 3.63816 14.4503Z" fill="currentcolor" />
                  <path opacity="0.5" d="M9.00382 16.552C7.89017 16.552 6.80163 16.3259 5.75496 15.8821C5.43678 15.7482 5.28606 15.3797 5.42003 15.0616C5.554 14.7434 5.92243 14.5927 6.24062 14.7266C7.12819 15.1034 8.05764 15.296 8.99545 15.296C11.7 15.296 14.2874 13.6716 16.0961 10.833C16.7241 9.85333 16.7241 8.14517 16.0961 7.16548C15.8365 6.75519 15.5518 6.36164 15.2503 5.99321C15.0326 5.72527 15.0745 5.33172 15.3425 5.10564C15.6104 4.88793 16.0039 4.92142 16.23 5.19775C16.5566 5.59967 16.8748 6.03508 17.1595 6.48724C18.047 7.86885 18.047 10.1213 17.1595 11.5113C15.1164 14.7099 12.1438 16.552 9.00382 16.552Z" fill="currentcolor" />
                  <path d="M9.58061 12.5747C9.28754 12.5747 9.01959 12.3654 8.96098 12.0639C8.89399 11.7206 9.12007 11.3941 9.46338 11.3355C10.3845 11.168 11.1548 10.3976 11.3223 9.47657C11.3893 9.13327 11.7158 8.91556 12.0591 8.97417C12.4024 9.04116 12.6285 9.36772 12.5615 9.71103C12.2936 11.1596 11.1381 12.3068 9.69783 12.5747C9.65597 12.5663 9.62247 12.5747 9.58061 12.5747Z" fill="currentcolor" />
                  <path d="M0.625908 18.0007C0.466815 18.0007 0.307721 17.9421 0.18212 17.8165C-0.0607068 17.5736 -0.0607068 17.1717 0.18212 16.9289L6.43702 10.674C6.67984 10.4312 7.08177 10.4312 7.32459 10.674C7.56742 10.9168 7.56742 11.3188 7.32459 11.5616L1.0697 17.8165C0.944096 17.9421 0.785002 18.0007 0.625908 18.0007Z" fill="currentcolor" />
                  <path d="M11.122 7.50881C10.9629 7.50881 10.8038 7.45019 10.6782 7.32459C10.4354 7.08177 10.4354 6.67984 10.6782 6.43702L16.9331 0.182121C17.1759 -0.0607068 17.5779 -0.0607068 17.8207 0.182121C18.0635 0.424948 18.0635 0.826869 17.8207 1.0697L11.5658 7.32459C11.4402 7.45019 11.2811 7.50881 11.122 7.50881Z" fill="currentcolor" />
                </svg>
              ) : (
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6.77778C1 6.77778 3.90909 1 9 1C14.0909 1 17 6.77778 17 6.77778C17 6.77778 14.0909 12.5556 9 12.5556C3.90909 12.5556 1 6.77778 1 6.77778Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.00018 8.94466C10.2052 8.94466 11.182 7.97461 11.182 6.77799C11.182 5.58138 10.2052 4.61133 9.00018 4.61133C7.79519 4.61133 6.81836 5.58138 6.81836 6.77799C6.81836 7.97461 7.79519 8.94466 9.00018 8.94466Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </div>
        </div>
      </div>
      
      <div className="tp-login-bottom">
        <button 
          type="submit" 
          className="tp-login-btn w-100"
          disabled={isLoading}
        >
          {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </div>
    </form>
  )
}
