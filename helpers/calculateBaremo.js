export const calcularBaremo = ({ direccionId, dependencia_economica, residenciaId }) => {
  let baremo = 0;

  // Puntos por dirección (foráneo)
  if (direccionId === 4) baremo += 4;

  // Asegurar que dependencia_economica sea numérico
  const dependenciaNum = Number(dependencia_economica) || 0;

  // Puntos por dependencia económica
  switch (true) {
    case (dependenciaNum < 160):
      baremo += 5;
      break;
    case (dependenciaNum < 300):
      baremo += 3;
      break;
    case (dependenciaNum < 600):
      baremo += 2;
      break;
    default:
      baremo += 1;
  }

  // Puntos por tipo de residencia
  switch (residenciaId) {
    case 1: // Residencia estudiantil
      baremo += 5;
      break;
    case 2: // Hogar familiar
      baremo += 3;
      break;
    case 3: // Vivienda propia
      baremo += 2;
      break;
    default:
      baremo += 1;
  }

  return baremo;
};