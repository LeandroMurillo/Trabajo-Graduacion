import { List } from '@toolpad/core/Crud';
import { cuotasDataSource } from '../data/cuotas';

export default function CuotasList() {
	return <List dataSource={cuotasDataSource} />;
}
