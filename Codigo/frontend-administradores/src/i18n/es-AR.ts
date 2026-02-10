import { createTheme } from '@mui/material/styles';
import { esES as coreEsES } from '@mui/material/locale';
import { esES as dataGridEsES } from '@mui/x-data-grid/locales';

// Toolpad (AppProvider / Crud)
export const esARLocaleText = {
	// Cuenta
	accountSignInLabel: 'Iniciar sesión',
	accountSignOutLabel: 'Cerrar sesión',
	accountPreviewIconButtonLabel: 'Usuario actual',
	accountPreviewTitle: 'Cuenta',

	// Login
	signInTitle: 'Panel de administración',
	signInSubtitle: 'Iniciá sesión para gestionar tu empresa',
	providerSignInTitle: () => `Iniciar sesión`,
	signInRememberMe: 'Recordarme',

	// auth fields
	email: 'Correo electrónico',
	passkey: 'Passkey',
	username: 'Nombre de usuario',
	password: 'Contraseña',

	// Common
	or: 'O',
	to: 'A',
	with: 'Con',

	save: 'Guardar',
	cancel: 'Cancelar',
	ok: 'Aceptar',
	close: 'Cerrar',
	delete: 'Eliminar',
	alert: 'Alerta',
	confirm: 'Confirmar',
	loading: 'Cargando...',

	// CRUD - List toolbar / actions
	createNewButtonLabel: 'Añadir',
	reloadButtonLabel: 'Recargar',

	// CRUD - Create/Edit/Delete labels + feedback
	createLabel: 'Crear',
	createSuccessMessage: 'Creado correctamente.',
	createErrorMessage: 'No se pudo crear.',

	editLabel: 'Editar',
	editSuccessMessage: 'Actualizado correctamente.',
	editErrorMessage: 'No se pudo actualizar.',

	deleteLabel: 'Borrar',
	deleteConfirmTitle: 'Confirmar borrado',
	deleteConfirmMessage: '¿Seguro que querés borrar este elemento?',
	deleteConfirmLabel: 'Borrar',
	deleteCancelLabel: 'Cancelar',
	deleteSuccessMessage: 'Borrado correctamente.',
	deleteErrorMessage: 'No se pudo borrar.',

	deletedItemMessage: 'Este elemento ya no existe o fue borrado.',
} as const;

export const esARTheme = createTheme({}, coreEsES, dataGridEsES);
