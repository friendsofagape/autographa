import Scribex from '@/components/EditorPage/Scribex/Scribex';
import ScribexContextProvider from '@/components/context/ScribexContext';

export default function XelahEditor() {
	return (
		<ScribexContextProvider>
			<Scribex />
		</ScribexContextProvider>
	);
}
