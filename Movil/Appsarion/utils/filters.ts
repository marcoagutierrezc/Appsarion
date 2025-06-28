interface Departamento {
    id: number;
    departamento: string;
    ciudades: string[];
}
export const obtenerListaDepartamentos = (data: Departamento[]): string[] => {
    return data.map(depto => depto.departamento);
};

export const obtenerCiudadesPorDepartamento = (departamento: string, datos: Departamento[]): string[] => {
    const departamentoEncontrado = datos.find(d => d.departamento === departamento);
    return departamentoEncontrado ? departamentoEncontrado.ciudades : [];
};