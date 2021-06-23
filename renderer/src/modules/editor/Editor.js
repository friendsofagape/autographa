import BibleNavigation from '@/modules/biblenavigation/BibleNavigation';

import {
  LockOpenIcon,
  LockClosedIcon,
  BookmarkIcon,
  CogIcon,
  AnnotationIcon,
} from '@heroicons/react/outline';

import {
  ChevronDownIcon,
} from '@heroicons/react/solid';

import CrossReferenceIcon from '@/icons/crossreference.svg';
import FootNotesIcon from '@/icons/footnotes.svg';

import styles from './Editor.module.css';

export default function Editor() {
  return (
    <>
      <div className="flex items-center justify-between bg-secondary">
        <BibleNavigation />
        <div className="flex items-center">
          <div>
            <LockOpenIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div className="mx-2 px-2 py-2 border-r-2 border-l-2 border-white border-opacity-10">
            <BookmarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div className="mr-2">
            <CogIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="border-l-2 border-r-2 border-secondary px-3 py-4 pb-16 prose-sm max-w-none overflow-y-auto h-full no-scrollbars">
        <h3 className="text-secondary">Jesus Has Risen</h3>
        <p>
          <sup className={styles.verseNumber}>1</sup>
          After the Sabbath, at dawn on the first day of the week, Mary Magdalene and the other Mary went to look at the tomb.
          <span className={styles.editToolWrap}>
            <AnnotationIcon className={styles.editTool} aria-hidden="true" />
          </span>
        </p>
        <p>
          <sup className={styles.verseNumber}>2</sup>
          There was a violent earthquake, for an angel of
          <span className={styles.editToolWrap}>
            <FootNotesIcon fill="currentColor" className={styles.editTool} aria-hidden="true" />
          </span>
          the Lord came down from heaven and, going to the tomb, rolled back the stone and sat on it.
        </p>
        <p>
          <sup className={styles.verseNumber}>3</sup>
          His appearance was like lightning, and his clothes were white as snow.
          <span className={styles.editToolWrap}>
            <CrossReferenceIcon fill="currentColor" className={styles.editTool} aria-hidden="true" />
          </span>
        </p>
        <p>
          <sup className={styles.verseNumber}>4</sup>
          The guards were so afraid of him that they shook and became like dead men.
        </p>
        <p>
          <sup className={styles.verseNumber}>5</sup>
          The angel said to the women, “Do not be afraid, for I know that you are looking for Jesus, who was crucified.
        </p>
        <p>
          <sup className={styles.verseNumber}>6</sup>
          He is not here; he has risen, just as he said. Come and see the place where he lay.
        </p>
        <p>
          <sup className={styles.verseNumber}>7</sup>
          Then go quickly and tell his disciples: ‘He has risen from the dead and is going ahead of you into Galilee. There you will see him.’ Now I have told you.”
        </p>
        <p>
          <sup className={styles.verseNumber}>8</sup>
          So the women hurried away from the tomb, afraid yet filled with joy, and ran to tell his disciples.
        </p>
        <p>
          <sup className={styles.verseNumber}>9</sup>
          Suddenly Jesus met them.
          <span className={styles.redLetters}>“Greetings,”</span>
          he said. They came to him, clasped his feet and worshiped him.
        </p>
        <p>
          <sup className={styles.verseNumber}>10</sup>
          Then Jesus said to them,
          <span className={styles.redLetters}>“Do not be afraid. Go and tell my brothers to go to Galilee; there they will see me.”</span>
        </p>
        <h3>The Guards’ Report</h3>
        <p>
          <sup className={styles.verseNumber}>11</sup>
          While the women were on their way, some of the guards went into the city and reported to the chief priests everything that had happened.
        </p>
        <p>
          <sup className={styles.verseNumber}>12</sup>
          When the chief priests had met with the elders and devised a plan, they gave the soldiers a large sum of money,
        </p>
        <p>
          <sup className={styles.verseNumber}>13</sup>
          telling them, “You are to say, ‘His disciples came during the night and stole him away while we were asleep.’
        </p>
        <p>
          <sup className={styles.verseNumber}>14</sup>
          If this report gets to the governor, we will satisfy him and keep you out of trouble.”
        </p>
        <p>
          <sup className={styles.verseNumber}>15</sup>
          So the soldiers took the money and did as they were instructed. And this story has been widely circulated among the Jews to this very day.
        </p>
        <h3>The Great Commission</h3>
        <p>
          <sup className={styles.verseNumber}>16</sup>
          Then the eleven disciples went to Galilee, to the mountain where Jesus had told them to go.
        </p>
        <p>
          <sup className={styles.verseNumber}>17</sup>
          When they saw him, they worshiped him; but some doubted.
        </p>
        <p>
          <sup className={styles.verseNumber}>18</sup>
          Then Jesus came to them and said,
          {' '}
          <span className={styles.redLetters}>“All authority in heaven and on earth has been given to me.</span>
        </p>
        <p>
          <sup className={styles.verseNumber}>19</sup>
          <span className={styles.redLetters}>Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, 20 and teaching them to obey</span>
        </p>
        <p>
          <sup className={styles.verseNumber}>20</sup>
          <span className={styles.redLetters}>everything I have commanded you. And surely I am with you always, to the very end of the age.”</span>
        </p>
      </div>
    </>

  );
}
