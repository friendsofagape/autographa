import dynamic from 'next/dynamic';

import {
  TrashIcon,
  MicrophoneIcon,
  ChatIcon,
  RefreshIcon,
  ChevronDownIcon,
  CogIcon,
  MinusIcon,
  PlusIcon,
  ChatBubbleBottomCenterTextIcon,
  SpeakerphoneIcon,
  ArrowNarrowRightIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

import AuthenticationContextProvider from '@/components/Login/AuthenticationContextProvider';
import ProjectContextProvider from '@/components/context/ProjectContext';
import ReferenceContextProvider from '@/components/context/ReferenceContext';
import CustomNavigationContextProvider from '@/components/context/CustomNavigationContext';
import AutographaContextProvider from '@/components/context/AutographaContext';
import EditorLayout from '@/layouts/editor/Layout';
import Editor from '@/modules/editor/Editor';
import BibleNavigation from '@/modules/biblenavigation/BibleNavigation';

import { classNames } from '@/util/classNames';

import PlayIcon from '@/icons/basil/Outline/Media/Play.svg';
import PauseIcon from '@/icons/basil/Outline/Media/Pause.svg';

const AudioWaveform = dynamic(() => import('./WaveForm'), { ssr: false });

const verses = [
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

const mainChunk = {
  id: 1,
  img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-01.jpg',
  text: 'आदि में परमेश्वर ने आकाश एवं पृथ्वी को रचा. पृथ्वी बिना आकार के तथा खाली थी, और पानी के ऊपर अंधकार था तथा परमेश्वर का आत्मा जल के ऊपर मंडरा रहा था. उसके बाद परमेश्वर ने कहा, “प्रकाश हो जाए,” और प्रकाश हो गया. परमेश्वर ने प्रकाश को देखा कि अच्छा है. परमेश्वर ने प्रकाश को अंधकार से अलग किया.',
};

const chunks = [
  {
    id: 1,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-02.jpg',
    text: 'परमेश्वर ने प्रकाश को “दिन” तथा अंधकार को “रात” कहा और शाम हुई, फिर सुबह हुई—इस प्रकार पहला दिन हो गया.”',
  },
  {
    id: 2,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-03.jpg',
    text: 'फिर परमेश्वर ने कहा, “जल के बीच ऐसा विभाजन हो कि जल',
  },
  {
    id: 3,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-04.jpg',
    text: 'इसलिये परमेश्वर ने नीचे के जल और ऊपर के जल को अलग किया. यह वैसा ही हो गया.',
  },
  {
    id: 4,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-05.jpg',
    text: 'परमेश्वर ने इस अंतर को “आकाश” नाम दिया. और शाम हुई, फिर सुबह हुई—इस प्रकार दूसरा दिन हो गया.',
  },
  {
    id: 5,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-06.jpg',
    text: 'फिर परमेश्वर ने कहा, “आकाश के नीचे का पानी एक जगह इकट्ठा हो जाए और सूखी भूमि दिखाई दे” और वैसा ही हो गया.',
  },
  {
    id: 6,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-07.jpg',
    text: 'परमेश्वर ने सूखी भूमि को “धरती” तथा जो जल इकट्ठा हुआ उसको “सागर” कहा और परमेश्वर ने देखा कि वह अच्छा है.',
  },
  {
    id: 7,
    img: 'https://cdn.door43.org/obs/jpg/360px/obs-en-01-08.jpg',
    text: 'फिर परमेश्वर ने कहा, “पृथ्वी से हरी घास तथा पेड़ उगने लगें: और पृथ्वी पर फलदाई वृक्षों में फल लगने लगें.” और वैसा हो गया.”',
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
                <div className="grid grid-cols-7 h-audio-editor">
                  <div className="bg-white col-span-3 m-3 rounded-md shadow overflow-hidden">
                    <div className="flex items-center justify-between bg-gray-100">
                      <BibleNavigation />
                      <div
                        aria-label="editor-pane"
                        className="h-4 mr-10 flex justify-center items-center text-dark text-xxs uppercase tracking-wider font-bold leading-3 truncate"
                      >
                        Source
                      </div>
                    </div>
                    <div className="px-3 py-2 rounded-md shadow overflow-y-auto h-full no-scrollbars">
                      {verses.map((story, index) => (
                        <div
                          key={story.id}
                          className="mb-2 p-2 px-3 bg-gray-100 border border-gray-200 justify-center items-start rounded-md"
                        >
                          <div className="flex gap-2">
                            <div>
                              <div className="h-5 w-5 mt-1 flex justify-center items-center bg-primary text-white rounded-full font-semibold text-xs">
                                {index + 1}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {story.text}
                            </p>
                          </div>
                          <div className="mt-2">
                            <AudioWaveform
                              height={24}
                              waveColor="#333333"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white col-span-4 m-3 ml-0 border-b-2 border-secondary rounded-md shadow overflow-hidden">
                    <Editor>
                      <div
                        key={mainChunk.id}
                        className="relative bg-gray-100 m-3 px-3 py-4 justify-center items-center
                          border border-gray-200 rounded-lg
                          hover:bg-light cursor-pointe"
                      >
                        <div className="flex w-full group-hover:text-white">
                          <div className="flex items-center justify-center bg-primary w-10 h-8 mr-2 rounded-full text-sm text-white">
                            {2}
                          </div>
                          <p className="m-0 w-full text-sm text-gray-500">
                            {mainChunk.text}
                          </p>

                          <button
                            type="button"
                            className="flex items-center justify-center bg-dark hover:bg-primary w-24 h-8 ml-2 px-3 rounded-full text-white"
                          >
                            <SpeakerphoneIcon
                              className="w-4 h-4 mr-1"
                              aria-hidden="true"
                            />
                            <ArrowNarrowRightIcon
                              className="w-4 h-4 mr-1"
                              aria-hidden="true"
                            />
                            <ChatBubbleBottomCenterTextIcon
                              className="w-4 h-4 mr-1"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <div className="mt-2">
                          <AudioWaveform
                            height={24}
                            waveColor="#333333"
                          />
                        </div>
                        <div className="bg-white mt-5 border border-gray-200 rounded-lg relative">
                          <span
                            className="p-1 px-2 h-6 align-baseline bg-primary text-white inline-block
                                          text-xxs uppercase tracking-wider rounded-br-lg absolute top-0 left-0"
                          >
                            Automatic Speech to text
                            suggestion
                          </span>
                          <textarea className="p-2 mt-7 m-0 w-full text-sm text-gray-600 border-0 focus:ring-0">
                            {mainChunk.text}
                          </textarea>
                        </div>
                        <div className="flex mt-2">
                          <button
                            type="button"
                            className="flex p-1 px-2 items-center justify-center bg-error  rounded-lg text-xxs font-bold text-white uppercase tracking-wider"
                          >
                            <XMarkIcon
                              className="w-4 h-4 mr-1"
                              aria-hidden="true"
                            />
                            Discard
                          </button>
                          <button
                            type="button"
                            className="flex ml-2 p-1 px-2 items-center justify-center bg-success rounded-lg text-xxs font-bold text-white uppercase tracking-wider"
                          >
                            <CheckIcon
                              className="w-4 h-4 mr-1"
                              aria-hidden="true"
                            />
                            Accept
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        {chunks.map((story, index) => (
                          <div
                            key={story.id}
                            className={classNames(
                            index === 0
                              || index === 1
                              ? 'bg-primary'
                              : 'bg-gray-50',
                            'relative group grid grid-cols-1 content-between m-3 border border-gray-100 justify-center items-center rounded-lg hover:bg-primary cursor-pointer',
                          )}
                          >
                            <div
                              className={classNames(
                              index === 0
                                || index === 1
                                ? 'text-white'
                                : 'text-gray-500',
                              'px-3 py-4 relative flex w-full text-sm group-hover:text-white',
                            )}
                            >
                              <div className="hidden group-hover:flex items-center justify-center bg-secondary/60 duration-300 absolute left-0 top-0 bottom-0 right-0 z-10 text-center rounded-t-lg">
                                <PencilIcon
                                  className="w-6 h-6 mr-1"
                                  aria-hidden="true"
                                />
                              </div>

                              <div className="flex items-center justify-center bg-dark w-6 h-6 mr-2 rounded-full text-xxs text-white">
                                {1 + index}
                              </div>
                              <p className="m-0 w-full">
                                {story.text}
                              </p>
                            </div>
                            <div className="flex justify-between px-3 my-4 content-between">
                              <div className="flex items-center">
                                <button
                                  type="button"
                                  className="flex p-1 px-2 items-center justify-center bg-white border border-gray-200 rounded-full text-xxs font-bold text-primary uppercase tracking-wider"
                                >
                                  <ChatIcon
                                    className="w-4 h-4 mr-1"
                                    aria-hidden="true"
                                  />
                                  23
                                </button>
                                {(index === 0
                                || index
                                  === 1) && (
                                  <button
                                    type="button"
                                    className="flex p-1 px-2 ml-2 items-center justify-center bg-success rounded-full text-xxs font-bold text-white uppercase tracking-wider"
                                  >
                                    Merge
                                  </button>
                              )}
                              </div>

                              <div className="flex w-full items-center justify-end">
                                <div className="flex items-center justify-center bg-dark w-6 h-6 mr-2 rounded-full text-xxs font-bold text-white uppercase">
                                  a
                                </div>
                                <div className="flex items-center justify-center bg-gray-200 border border-gray-300 w-6 h-6 mr-2 rounded-full text-xxs font-bold text-gray-500 uppercase">
                                  b
                                </div>
                                <div className="flex items-center justify-center bg-gray-200 border border-gray-300 w-6 h-6 mr-2 rounded-full text-xxs font-bold text-gray-500 uppercase">
                                  c
                                </div>
                              </div>
                            </div>
                            <div className="px-3 pb-4">
                              <AudioWaveform
                                height={18}
                                waveColor={
                                index
                                  === 0
                                || index === 1
                                  ? '#fff'
                                  : '#999'
                              }
                                btnColor={
                                index
                                  === 0
                                || index === 1
                                  ? 'text-light'
                                  : 'text-gray-300'
                              }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Editor>
                  </div>

                  <div className="col-span-7 lg:h-52 bg-black text-white">
                    <div className="grid grid-cols-4 lg:grid-cols-7 pt-2 px-4 justify-between items-center">
                      <div className="flex flex-col col-span-2 lg:col-span-1 px-10 items-center border-r border-r-gray-800">
                        <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
                          audio
                        </div>
                        <button
                          type="button"
                          className="flex justify-center mt-1 items-center px-2 py-1 text-white
                                      font-semibold text-xxs rounded-full leading-3 tracking-wider uppercase bg-primary"
                        >
                          <div className="">
                            source
                          </div>
                          <ChevronDownIcon
                            className="w-3 h-3 ml-1"
                            aria-hidden="true"
                          />
                        </button>
                      </div>

                      <div className="flex flex-col col-span-2 lg:col-span-1 px-10 items-center lg:border-r lg:border-r-gray-800">
                        <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
                          speed
                        </div>
                        <button
                          type="button"
                          className="flex justify-center mt-1 items-center px-2 py-1 text-white
                                      font-semibold text-xxs rounded-full leading-3 tracking-wider uppercase bg-primary"
                        >
                          <div className="">2x</div>
                          <ChevronDownIcon
                            className="w-3 h-3 ml-1"
                            aria-hidden="true"
                          />
                        </button>
                      </div>

                      <div className="flex col-span-4 lg:col-span-3 my-5 lg:my-0 gap-5 px-10 justify-center lg:border-r lg:border-r-gray-800">
                        <div className="flex flex-col items-center">
                          <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
                            rewind
                          </div>
                          <button
                            type="button"
                            className="p-2 bg-dark rounded-md hover:bg-error"
                          >
                            <RefreshIcon
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
                            record
                          </div>
                          <button
                            type="button"
                            className="p-2 bg-error rounded-md hover:bg-error"
                          >
                            <MicrophoneIcon
                              className="w-5 h-5 text-white"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
                            play
                          </div>
                          <button
                            type="button"
                            className="p-2 bg-dark rounded-md hover:bg-primary"
                          >
                            <PlayIcon
                              fill="currentColor"
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
                            pause
                          </div>
                          <button
                            type="button"
                            className="p-2 bg-dark rounded-md hover:bg-primary"
                          >
                            <PauseIcon
                              fill="currentColor"
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
                            stop
                          </div>
                          <button
                            type="button"
                            className="p-2 bg-dark rounded-md hover:bg-error"
                          >
                            <TrashIcon
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="text-xxs mb-2 text-gray-500 uppercase tracking-wider">
                            Volume
                          </div>
                          <div className="flex gap-2 mt-2 items-center justify-center">
                            <MinusIcon
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                            <div className="bg-white w-40 h-2 rounded-full">
                              <div className="bg-primary w-20 h-2 rounded-full" />
                            </div>
                            <PlusIcon
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col col-span-2 lg:col-span-1 px-10 items-center border-r border-r-gray-800">
                        <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
                          Takes
                        </div>
                        <div className="flex gap-2">
                          <div className="w-6 h-6 flex items-center justify-center bg-success text-xs font-bold text-white uppercase tracking-wider rounded-full">
                            a
                          </div>
                          <div className="w-6 h-6 flex items-center justify-center bg-white text-xs font-bold text-dark uppercase tracking-wider rounded-full">
                            b
                          </div>
                          <div className="w-6 h-6 flex items-center justify-center bg-white text-xs font-bold text-dark uppercase tracking-wider rounded-full">
                            c
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col col-span-2 lg:col-span-1 px-10 items-center justify-center">
                        <div className="text-xxs text-gray-500 uppercase tracking-wider mb-2">
                          settings
                        </div>
                        <div className="flex flex-col items-center">
                          <button
                            type="button"
                            className="p-2 bg-dark rounded-md hover:bg-error"
                          >
                            <CogIcon
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 mt-5 pt-5 bg-black text-white">
                      <AudioWaveform
                        height={120}
                        barGap="4"
                        barWidth="2"
                        waveColor="#ffffff"
                        btnColor="text-white"
                      />
                    </div>
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
