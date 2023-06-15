export const generateUserErrorInfo = (product) => {
    return `
        Alguno de los campos para crear el producto no es valido
        Lista de campos requeridos:
        Title: Debe ser un campo único para cada producto, ud ingresó ${product.title}
        Code: Debe ser un campo numérico exclusivo, ud ingresó ${product.code}
        *** asegurese que de que alguno de los campos existentes no tengan el mismo titulo o codigo que ud acaba de ingresar ***
    `
}