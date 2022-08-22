import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HtmlPerfEditor } from '@xelah/type-perf-html';
import LoadingScreen from '@/components/Loading/LoadingScreen';
import SaveIndicator from '@/components/Loading/SaveIndicator';
import { ReferenceContext } from '@/components/context/ReferenceContext';
import { ProjectContext } from '@/components/context/ProjectContext';
export default function Editor(props) {
	const {
		sequenceIds,
		isSaving,
		isLoading,
		htmlPerf,
		sectionable,
		blockable,
		editable,
		preview,
		verbose,
		bookName,
		bookChange,
		setBookChange,
		addSequenceId,
		saveHtmlPerf,
		setGraftSequenceId,
	} = props;

	const {
		state: { chapter },
	} = useContext(ReferenceContext);

	const { t } = useTranslation();

	const {
		states: { openSideBar },
		actions: { setOpenSideBar, setSideBarTab },
	} = useContext(ProjectContext);
	console.log('efitor', { sequenceIds });
	const sequenceId = sequenceIds.at(-1);
	const style =
		isSaving || isLoading || !sequenceId ? { cursor: 'progress' } : {};
	const bookChanged = sequenceId === htmlPerf?.mainSequenceId ? true : false;
	const handlers = {
		onBlockClick: ({ content: _content, element }) => {
			const _sequenceId = element.dataset.target;
			const { tagName } = element;
			const isInline = tagName === 'SPAN';
			if (_sequenceId) {
				setGraftSequenceId(_sequenceId);
				setOpenSideBar(!openSideBar);
				setSideBarTab('footnotes');
			} else {
				setSideBarTab('');
				setGraftSequenceId(null);
			}
		},
	};
	useEffect(() => {
		setBookChange(false);
	}, [htmlPerf]);

	const {
		actions: { setEditorSave },
	} = useContext(ProjectContext);

	const autoSaveIndication = () => {
		setEditorSave(<SaveIndicator />);
		setTimeout(() => {
			setEditorSave(t('label-saved'));
		}, 1000);
	};
	useEffect(() => {
		if (isSaving) autoSaveIndication();
	}, [isSaving]);

	const _props = {
		htmlPerf: htmlPerf,
		onHtmlPerf: saveHtmlPerf,
		chapterIndex: chapter,
		sequenceIds,
		addSequenceId,
		options: {
			sectionable,
			blockable,
			editable,
			preview,
		},
		decorators: {},
		verbose,
		handlers,
		autoSaveIndication,
	};

	return (
		<div className='editor' style={style}>
			{(!sequenceId && <LoadingScreen />) ||
				(bookChange && <LoadingScreen />)}
			{sequenceId && !bookChange && <HtmlPerfEditor {..._props} />}
		</div>
	);
}
