import React, { useState } from 'react';

import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import CustomNavigationContextProvider from '@/components/context/CustomNavigationContext';
import AutographaContextProvider from '@/components/context/AutographaContext';

import EditorLayout from '@/layouts/editor/Layout';
import Editor from '@/modules/editor/Editor';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import RowSection from './RowSection';

const stories = [
  {
    id: 1,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-01.jpg',
    text: 'Then God said, “Let there be light!” And there was light. God saw that the light was good and called it “day.” He separated it from the darkness, which he called “night.” God created the light on the first day of creation.',
  },
  {
    id: 2,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-02.jpg',
    text: 'On the second day of creation, God said, “Let there be an expanse above the waters.” And there was an expanse. God called this expanse “sky.”',
  },
  {
    id: 3,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-03.jpg',
    text: 'On the third day, God said, “Let the water come together in one place and the dry land appear.” He called the dry land “earth,” and he called the water “seas.” God saw that what he had created was good.',
  },
  {
    id: 4,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-04.jpg',
    text: 'Then God said, “Let the earth produce all kinds of trees and plants.” And that is what happened. God saw that what he had created was good.',
  },
  {
    id: 5,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-05.jpg',
    text: 'On the fourth day of creation, God said, “Let there be lights in the sky.” And the sun, the moon, and the stars appeared. God made them to give light to the earth and to mark day and night, seasons and years. God saw that what he had created was good.',
  },
  {
    id: 6,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-06.jpg',
    text: 'On the fifth day, God said, “Let living things fill the waters, and birds fly in the sky.” This is how he made everything that swims in the water and all the birds. God saw that it was good, and he blessed them.',
  },
  {
    id: 7,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-07.jpg',
    text: 'On the sixth day of creation, God said, “Let there be all kinds of land animals!” And it happened just like God said. Some were farm animals, some crawled on the ground, and some were wild. And God saw that it was good.',
  },
  {
    id: 8,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-08.jpg',
    text: 'Then God said, “Let us make human beings in our image to be like us. They will rule over the earth and all the animals.”',
  },
  {
    id: 9,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-09.jpg',
    text: 'So God took some soil, formed it into a man, and breathed life into him. This man’s name was Adam. God planted a large garden where Adam could live, and put him there to care for it.',
  },
  {
    id: 10,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-10.jpg',
    text: 'In the middle of the garden, God planted two special trees—the tree of life and the tree of the knowledge of good and evil. God told Adam that he could eat from any tree in the garden except from the tree of the knowledge of good and evil. If he ate from this tree, he would die.',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ReferenceSelector() {
  const [blur, setBlur] = useState(false);

  return (
    <AuthenticationContextProvider>
      <AutographaContextProvider>
        <ProjectContextProvider>
          <ReferenceContextProvider>
            <CustomNavigationContextProvider>
              <EditorLayout>
                <div className="grid grid-flow-col auto-cols-fr m-3 h-editor gap-2">

                  <div className="bg-white rounded-md grid auto-rows-fr gap-2">
                    <RowSection ishidden />
                  </div>

                  <div className="bg-white rounded-md shadow overflow-hidden filter group">

                    <div className="bg-gray-200 rounded-t text-center text-gray-600 relative overflow-hidden">
                      <div className="bg-gray-200 z-50 rounded-t overflow-hidden">
                        <div className="flex items-center">
                          <div className="ml-4 h-8 flex justify-center items-center text-xxs uppercase tracking-wider font-bold leading-3 truncate">
                            Bible
                          </div>

                          <div className="flex bg-gray-300 absolute h-full -right-0 rounded-tr invisible group-hover:visible">
                            <button
                              type="button"
                              onClick={() => setBlur(!blur)}
                            >
                              {blur
                                ? (
                                  <EyeIcon
                                    className="h-5 w-5 mx-3 text-gray-800"
                                  />
)
                                : (
                                  <EyeOffIcon
                                    className="h-5 w-5 mx-3 text-gray-800"
                                  />
)}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={classNames(blur ? 'blur-xl' : '', 'px-3 py-2 rounded-md shadow overflow-y-auto h-full no-scrollbars')}>
                      {
                        stories.map((story) => (
                          <div key={story.id} className="flex gap-5 mb-5 justify-center items-center">
                            <img className="w-1/4 rounded-lg" src={story.img} alt="" />
                            <p className="text-sm text-gray-600">
                              {story.text}
                            </p>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  <div className="bg-white border-b-2 border-secondary rounded-md shadow overflow-hidden">
                    <Editor>
                      {
                        stories.map((story) => (
                          <div key={story.id} className={`px-3 py-4 border-b border-gray-100 justify-center items-center hover:bg-light cursor-pointer ${story.id === 2 && 'bg-light'}`}>
                            <p className="text-sm text-gray-600">
                              {story.text}
                            </p>
                          </div>
                        ))
                      }
                    </Editor>
                  </div>
                </div>
              </EditorLayout>
            </CustomNavigationContextProvider>
          </ReferenceContextProvider>
        </ProjectContextProvider>
      </AutographaContextProvider>
    </AuthenticationContextProvider>
  );
}
