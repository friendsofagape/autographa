/* eslint-disable */
import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import CustomNavigationContextProvider from '@/components/context/CustomNavigationContext';
import AutographaContextProvider from '@/components/context/AutographaContext';
import EditorLayout from '@/layouts/editor/Layout';
import Editor from '@/modules/editor/Editor';

import PlayIcon from '@/icons/basil/Outline/Media/Play.svg';
import PauseIcon from '@/icons/basil/Outline/Media/Pause.svg';
import Waveform from '@/icons/waveform.svg';

import { TrashIcon, MicrophoneIcon, VolumeUpIcon } from '@heroicons/react/outline';

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

export default function ReferenceSelector() {
  return (
    <AuthenticationContextProvider>
      <AutographaContextProvider>
        <ProjectContextProvider>
          <ReferenceContextProvider>
            <CustomNavigationContextProvider>
              <EditorLayout>
                <div className="grid grid-cols-3 h-editor">
                  <div className="bg-white col-span-2 m-3 rounded-md shadow overflow-hidden">
                    <div className="px-3 py-2 rounded-md shadow overflow-y-auto h-full no-scrollbars">
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
                  <div className="bg-white m-3 ml-0 border-b-2 border-secondary rounded-md shadow overflow-hidden">
                    <Editor>
                      {
                        stories.map((story) => (
                          <>
                            <div key={story.id} className={`relative px-3 py-4 border-b border-gray-100 justify-center items-center hover:bg-light cursor-pointer ${story.id === 2 && 'bg-light'}`}>
                              <p className="text-sm text-gray-600">
                                {story.text}
                              </p>
                              <button
                                type="button"
                                className={`p-1 w-6 h-6 flex items-center justify-center absolute
                                bottom-3 right-3 rounded-md hover:bg-primary hover:text-white
                                // eslint-disable-next-line no-nested-ternary
                                ${story.id === 2
                                ? 'bg-primary text-white'
                                : story.id === 4 ? 'bg-success text-black'
                                : 'text-primary bg-gray-200' }
                                `}
                              >
                                <VolumeUpIcon
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                            {
                              story.id === 2
                              && (
                                <div className="flex p-2 px-4 justify-between items-center bg-black text-white">
                                  <div className="text-primary">
                                    <Waveform
                                      fill="currentColor"
                                      className="w-full h-1/3"
                                    />
                                  </div>
                                  <div className="text-white text-sm tracking-wider">
                                    10:30
                                  </div>
                                  <div className="flex gap-5">
                                    <button type="button" className="p-2 bg-dark rounded-md hover:bg-error">
                                      <MicrophoneIcon
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button type="button" className="p-2 bg-dark rounded-md hover:bg-primary">
                                      <PlayIcon
                                        fill="currentColor"
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button type="button" className="p-2 bg-dark rounded-md hover:bg-primary">
                                      <PauseIcon
                                        fill="currentColor"
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <button type="button" className="p-2 bg-dark rounded-md hover:bg-error">
                                      <TrashIcon
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </div>
                              )
                            }
                          </>
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
