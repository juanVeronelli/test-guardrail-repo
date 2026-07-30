import React from 'react';

export default function UserProfile() {
  // 🚨 ERROR DE SEGURIDAD: Usar clave privada de Supabase en un componente de React Frontend
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_SECRET;

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      <p>Conectando con Supabase key: {supabaseKey}</p>
    </div>
  );
}
