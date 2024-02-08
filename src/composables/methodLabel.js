export const useMethodLabel = () => {
  const formatearDescription = (description) => {
    // Convierte todo el texto a mayúsculas para estandarizar el formato.
    description = description.toUpperCase();
  
    // Agrega un espacio entre números y unidades, si no lo hay, incluyendo el manejo de texto adicional como '+' seguido de más texto.
    description = description.replace(
      /(\d)(ML|G|U|L|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|G\.|LB|GRS?\.?|UNI\.?|UN\.?)(\s|\+|(?![A-Z]))/g,
      (match, p1, p2, p3) => `${p1} ${p2}${p3 === ' ' ? '' : ' '}`
    ).replace(
      /(\s|\d)(ML|G|U|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|G\.|LB|GRS?\.?|UNI\.?|UN\.?)(\s|\+|(?![A-Z]))/g,
      (match, p1, p2, p3) => {
        // Convierte 'GRS' o 'GRS.' a 'g', y 'UNI' o 'UN' a 'u', manteniendo otras unidades en minúsculas.
        let unit = p2.match(/GRS?\.?/) ? 'g' : p2.match(/UNI\.?|UN\.?/) ? 'u' : p2.toLowerCase();
        return `${p1}${unit}${p3}`;
      }
    );
  
    // Asegura que las unidades y los símbolos como '+' estén correctamente espaciados.
    description = description.replace(
      /(\d\s[gmlkug]+)(\+)/g,
      "$1 $2"
    );
  
    // Agrega un espacio entre las unidades y el texto que las sigue directamente sin espacio,
    // como en 'G2PACK' -> 'G 2PACK'.
    description = description.replace(
      /(\d\s[gmlkug]+)([A-Z]+)/g,
      "$1 $2"
    );
  
    return description;
  };
  
  const formatearDescriptionMinusculas = (description) => {
    // Convierte todo el texto a mayúsculas para estandarizar el formato.
    description = description.toLowerCase();
  
    // Agrega un espacio entre números y unidades, si no lo hay, incluyendo el manejo de texto adicional como '+' seguido de más texto.
    description = description.replace(
      /(\d)(ml|g|u|l|kg|cápsulas|capsulas|tabletas|piezas|g\.|lb|grs?\.?)(\s|\+|$)/g,
      (match, p1, p2, p3) => `${p1} ${p2}${p3 === ' ' ? '' : ' '}`
    ).replace(
      /(\s|\d)(ml|g|u|l|kg|cápsulas|capsulas|tabletas|piezas|g\.|lb|grs?\.?)(\s|\+|$)/g,
      (match, p1, p2, p3) => {
        let unit = p2.match(/grs?\.?/) ? 'g' : p2.toLowerCase();
        return `${p1}${unit}${p3}`;
      }
    );
  
    // Asegura que las unidades y los símbolos como '+' estén correctamente espaciados.
    description = description.replace(
      /(\d\s[gmlkg]+)(\+)/g,
      "$1 $2"
    );
  
    return description;
  };

  return {
    formatearDescription,
    formatearDescriptionMinusculas
  };
};
