export const useMethodLabel = () => {
  const formatearDescription = (description) => {
    // Convierte todo el texto a mayúsculas para estandarizar el formato inicialmente.
    description = description.toUpperCase();

    // Asegura espaciado entre números y unidades, incluyendo el manejo de "LITROS" y ahora "MG".
    description = description.replace(
      /(\d)(ML|MG|G|U|L|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|G\.|LB|GRS?\.?|UNI\.?|UN\.?|LITROS)/g,
      "$1 $2"
    );

    // Corrige el espaciado para casos especiales como texto adyacente directamente después de unidades.
    description = description.replace(
      /(\d)\s(ML|MG|G|U|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|G\.|LB|GRS?\.?|UNI\.?|UN\.?|LITROS)\s?([A-Z]+)/g,
      "$1 $2 $3"
    );

    // Nuevo paso: Manejar las unidades sin número previo convirtiéndolas a minúsculas directamente.
    description = description.replace(
      /\b(ML|MG|G|U|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|LB|GRS?|UNI|UN)\b/g,
      (match) => match.toLowerCase()
    );

    // Convierte las unidades a minúsculas para estandarización final, solo cuando siguen a un número para evitar afectar otras palabras.
    description = description.replace(
      /(\d)\s(ML|MG|G|U|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|LB|GRS?|UNI|UN|UNIDADES)\b/g,
      (match, p1, p2) => {
        switch (p2) {
          case "UNIDADES":
            return `${p1} u`;
          case "MG":
            return `${p1} mg`; // Convierte específicamente "MG" a "mg".
          default:
            return `${p1} ${p2.toLowerCase()}`;
        }
      }
    );

    description = description.replace(/\b(NIDAD|NIDADES)\b/g, "");
    description = description.replace(/\b(u NI|u N|u ND)\b/g, "u");
    description = description.replace(/\b(g RS|g RAMOS)\b/g, "g");
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
