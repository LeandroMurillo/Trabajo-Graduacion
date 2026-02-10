import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function generarRutaCurriculum(idPostulante) {
	const fecha = new Date();
	const year = fecha.getFullYear();
	const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
	const day = fecha.getDate().toString().padStart(2, '0');
	const hours = fecha.getHours().toString().padStart(2, '0');
	const minutes = fecha.getMinutes().toString().padStart(2, '0');
	const seconds = fecha.getSeconds().toString().padStart(2, '0');

	return `CURR_${year}${month}${day}_${hours}${minutes}${seconds}_${idPostulante}.pdf`;
}

export async function guardarArchivoCurriculum(nombreCurriculum, fileData) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const storagePath = path.join(__dirname, 'storage', 'CURR');

	// Crear la carpeta si no existe
	if (!fs.existsSync(storagePath)) {
		fs.mkdirSync(storagePath, { recursive: true });
	}

	const filePath = path.join(storagePath, nombreCurriculum);
	await fs.promises.writeFile(filePath, fileData);
	return filePath;
}
