export const useMethodLabel = () => {
  const formatearDescription = (description) => {
    description = description.toUpperCase();

    description = description.replace(
      /(\d)(ML|G|U|L|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|G.)/g,
      "$1 $2"
    );

    description = description.replace(
      /(\s|\d)(ML|G|U|KG|CÁPSULAS|CAPSULAS|TABLETAS|PIEZAS|G.)(?=\s|$)/g,
      function (match, p1, p2) {
        return p1 + p2.toLowerCase();
      }
    );

    return description;
  };

  return {
    formatearDescription,
  };
};
