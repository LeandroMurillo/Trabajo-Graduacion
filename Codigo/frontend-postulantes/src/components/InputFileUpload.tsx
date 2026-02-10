import * as React from 'react';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

interface InputFileUploadProps {
	onFileChange?: (files: File[]) => void;
}

const InputFileUpload: React.FC<InputFileUploadProps> = ({ onFileChange }) => {
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (onFileChange) {
			if (event.target.files) {
				onFileChange(Array.from(event.target.files));
			}
		}
	};

	return (
		<Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
			Añadir CV
			<VisuallyHiddenInput type='file' accept='application/pdf' onChange={handleFileChange} />
		</Button>
	);
};

export default InputFileUpload;
